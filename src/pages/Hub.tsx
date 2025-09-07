import { useState, useEffect, useRef } from "react";
import {
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  getDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import NavbarProfile from "@/components/NavbarProfile";
import { HubFilter } from "@/components/HubFilter";
import leoProfanity from "leo-profanity";
import CreatePostDialog from "@/components/CreatePostDialog";
import DeleteCommentDialog from "@/components/DeleteCommentDialog";
import DeletePostDialog from "@/components/DeletePostDialog";
import PostDialog from "@/components/PostDialog";
import { useToast } from "@/hooks/use-toast";
import PostsGrid from "@/components/PostGrid";
import FlippingButton from "@/components/FlippingButton";

leoProfanity.loadDictionary();

const TITLE_LENGTH = 100;
const DESCRIPTION_LENGTH = 1000;
const COMMENT_LENGTH = 150;

// Date formatting util (unchanged)
const formatDate = (date) => {
  if (!date) return "";
  if (date?.toDate) date = date.toDate();
  if (typeof date === "string") date = new Date(date);
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HubPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newComment, setNewComment] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isPowering, setIsPowering] = useState(false);
  const [hidhlightPostButton, setHighlightPostButton] = useState(false);
  const postButtonRef = useRef(null);
  const inputRef = useRef(null);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    tags: "",
    type: "tool",
  });
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const selectedPost = posts.find((p) => p.id === selectedPostId);
  const [authChecked, setAuthChecked] = useState(false);

  // Set auth persistence
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("Persistence set to browserLocalPersistence"))
      .catch((error) => {
        console.error("Error setting persistence:", error);
        toast({
          title: "Persistence Error",
          description: "Failed to set session persistence.",
          variant: "destructive",
        });
      });
  }, []);

  // Handle redirect result and auth state
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        console.log("Redirect result:", result);
        if (result && result.user) {
          setUser({
            uid: result.user.uid,
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          });
          setIsLoggedIn(true);
          toast({
            title: "Welcome!",
            description: `Signed in as ${result.user.displayName || result.user.email}`,
          });
        } else {
          console.warn("No redirect result found. This might be the initial load.");
        }
      } catch (error) {
        console.error("Redirect error:", error.code, error.message);
        toast({
          title: "Login failed",
          description: `Error: ${error.message}`,
          variant: "destructive",
        });
      }
    };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({
          uid: u.uid,
          displayName: u.displayName,
          email: u.email,
          photoURL: u.photoURL,
        });
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [toast]);

  // Fetch posts (unchanged)
  useEffect(() => {
    if (!isLoggedIn) return;
    let q;
    if (activeTab === "top") {
      q = query(collection(db, "posts"), orderBy("likes", "desc"));
    } else {
      q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    }
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(data);
    });
    return () => unsub();
  }, [activeTab, isLoggedIn]);

  const lastCommentRef = useRef(null);
  useEffect(() => {
    if (selectedPost?.comments?.length && lastCommentRef.current) {
      lastCommentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedPost?.comments]);

  const getFilteredPosts = () => {
    let filtered = posts;
    switch (activeTab) {
      case "tools":
        filtered = filtered.filter((post) => post.type === "tool");
        break;
      case "ideas":
        filtered = filtered.filter((post) => post.type === "idea");
        break;
      case "top":
        break;
    }
    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return filtered;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "idea":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "tool":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "update":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const handleLogin = async () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        console.log("Initiating signInWithRedirect...");
        await signInWithRedirect(auth, googleProvider);
        console.log("Redirect initiated successfully.");
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) {
          toast({
            title: "Welcome!",
            description: `Signed in as ${result.user.displayName || result.user.email}`,
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/popup-blocked-by-browser") {
        toast({
          title: "Popup Blocked",
          description: "Please enable popups or try again.",
          variant: "destructive",
        });
      } else if (error.code !== "auth/popup-cancelled-by-user") {
        toast({
          title: "Login failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreatePost = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to create a post.",
        duration: 500,
      });
      return;
    }
    const cleanedTitle = leoProfanity.clean(newPost.title);
    const cleanedDescription = leoProfanity.clean(newPost.description);
    const cleanedTags = newPost.tags
      .split(",")
      .map((t) => leoProfanity.clean(t.trim()))
      .filter(Boolean);
    const payload = {
      ...newPost,
      title: cleanedTitle,
      description: cleanedDescription,
      tags: cleanedTags,
      author: user?.displayName || "You",
      authorId: user?.uid || null,
      avatar: (user?.displayName?.[0] || "Y").toUpperCase(),
      photoURL: user?.photoURL || null,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: serverTimestamp(),
    };
    try {
      await addDoc(collection(db, "posts"), payload);
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
      setNewPost({ title: "", description: "", tags: "", type: "tool" });
      setIsCreateModalOpen(false);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId) => {
    if (!postId) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
    }
  };

  const handleLike = async (postId) => {
    if (!isLoggedIn || !user?.email) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to like posts.",
      });
      return;
    }
    const current = posts.find((p) => p.id === postId);
    if (!current) return;
    const alreadyLiked = current.likedBy?.includes(user.email);
    const updatedLikedBy = alreadyLiked
      ? current.likedBy.filter((e) => e !== user.email)
      : [...(current.likedBy || []), user.email];
    const updatedLikes = updatedLikedBy.length;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedBy: updatedLikedBy, likes: updatedLikes }
          : p
      )
    );
    try {
      const postRef = doc(db, "posts", postId);
      if (alreadyLiked) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(user.email),
          likes: updatedLikes,
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayUnion(user.email),
          likes: updatedLikes,
        });
      }
    } catch (e) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likedBy: current.likedBy, likes: current.likes }
            : p
        )
      );
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim() || !user) return;
    const cleanedComment = leoProfanity.clean(newComment);
    const newCommentObj = {
      id: Date.now(),
      authorId: user.uid,
      author: user.displayName || "You",
      text: cleanedComment,
      time: new Date().toISOString(),
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), newCommentObj] }
          : p
      )
    );
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { comments: arrayUnion(newCommentObj) });
      setNewComment("");
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
        duration: 1000,
        className: "text-xs px-2 py-1 w-15",
      });
    } catch (e) {}
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!user) return;
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);
      if (!postSnap.exists()) return;
      const post = postSnap.data();
      const oldComments = post.comments || [];
      const updatedComments = oldComments.filter(
        (c) => !(c.id === commentId && user.uid === c.authorId)
      );
      await updateDoc(postRef, { comments: updatedComments });
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
        duration: 1000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to delete comment.",
        variant: "destructive",
      });
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-dots-gradient bg-dots pt-10 font-outfit flex items-center justify-center">
        <img
          src="OP.png"
          className="w-60 h-30 text-primary animate-pulse"
          alt="Loading"
        />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-dots-gradient bg-dots pt-10 font-outfit">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-10 lg:px-8">
            <div className="text-center">
              <div className="p-12 max-w-2xl mx-auto">
                <img
                  src="OP.png"
                  className="w-60 h-30 text-primary mx-auto mb-6"
                  alt="Logo"
                />
                <p className="text-xl text-muted-foreground mb-8">
                  Join our community of AI enthusiasts to share ideas, discover
                  tools, and connect with fellow innovators.
                </p>
                <Button
                  size="lg"
                  onClick={handleLogin}
                  className="px-8 py-3 bg-[#A66EFF] font-bold"
                >
                  Sign In with Google
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dots-gradient bg-dots font-outfit">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 mt-5 mb-5">
            <img src="Logo.png" className="w-30 h-12 text-primary" alt="Logo" />
            <div className="flex items-center gap-4">
              <NavbarProfile user={user} onLogin={handleLogin} />
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-20 pb-12 mt-10">
        <CreatePostDialog
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
          newPost={newPost}
          setNewPost={setNewPost}
          handleCreatePost={handleCreatePost}
          TITLE_LENGTH={TITLE_LENGTH}
          DESCRIPTION_LENGTH={DESCRIPTION_LENGTH}
        />
        <DeleteCommentDialog
          commentToDelete={commentToDelete}
          setCommentToDelete={setCommentToDelete}
          handleDeleteComment={handleDeleteComment}
          selectedPost={selectedPost}
        />
        <DeletePostDialog
          deleteConfirmOpen={deleteConfirmOpen}
          setDeleteConfirmOpen={setDeleteConfirmOpen}
          handleDeletePost={handleDeletePost}
          postToDelete={postToDelete}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-3xl mb-2 sm:mb-4 sm:text-4xl md:text-6xl lg:text-5xl m-5 font-light text-gray-400">
              <b className="text-white font-bold">Hello</b> {user.displayName},
            </div>
            <div className="mt-2 sm:mt-4 mx-5 flex flex-wrap items-center text-sm sm:text-base md:text-lg">
              <span>you've got ideas let's make them unstoppable,</span>
              <div className="mt-3 sm:mt-0 sm:ml-3 ml-0">
                <FlippingButton />
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto">
            <HubFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <div>
              {activeTab === "all"}
              {activeTab === "tools"}
              {activeTab === "ideas"}
              {activeTab === "top"}
            </div>
          </div>
          <PostsGrid
            posts={getFilteredPosts()}
            getTypeColor={getTypeColor}
            onSelectPost={setSelectedPostId}
          />
          {getFilteredPosts().length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No posts found for this filter.
              </p>
            </div>
          )}
        </div>
      </main>
      <PostDialog
        selectedPost={selectedPost}
        user={user}
        isPowering={isPowering}
        newComment={newComment}
        inputRef={inputRef}
        lastCommentRef={lastCommentRef}
        COMMENT_LENGTH={COMMENT_LENGTH}
        onClose={() => setSelectedPostId(null)}
        onLike={handleLike}
        onAddComment={handleAddComment}
        setNewComment={setNewComment}
        setPostToDelete={setPostToDelete}
        setDeleteConfirmOpen={setDeleteConfirmOpen}
        setCommentToDelete={setCommentToDelete}
      />
    </div>
  );
};

export default HubPage;