import { useState, useEffect, useRef } from "react";
import { Trash, MessageCircle, Calendar, Send, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FireLogo from "./Svg";
import { Badge } from "@/components/ui/badge";
import NavbarProfile from "@/components/NavbarProfile";
import Linkify from "linkify-react";
import { HubFilter } from "@/components/HubFilter";
import leoProfanity from "leo-profanity";
import CreatePostDialog  from "@/components/CreatePostDialog";
import DeleteCommentDialog from "@/components/DeleteCommentDialog";
import DeletePostDialog from "@/components/DeletePostDialog";
import PostDialog from "@/components/PostDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PostsGrid from "@/components/PostGrid";
import FlippingButton from "@/components/FlippingButton";
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
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
} from "@/lib/firebase";

const TITLE_LENGTH = 100;
const DESCRIPTION_LENGTH = 1000;
const COMMENT_LENGTH = 150;
leoProfanity.loadDictionary();

const formatDate = (date: any) => {
  if (!date) return "";

  if (date?.toDate) {
    date = date.toDate();
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
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
  const [user, setUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newComment, setNewComment] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isPowering, setIsPowering] = useState(false);
  const [hidhlightPostButton, setHighlightPostButton] = useState(false);
  const postButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleHighlightPostButton = () => {
    setHighlightPostButton(true);

    // remove highlight after 2 seconds
    setTimeout(() => {
      setHighlightPostButton(false);
    }, 2000);
  };

  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    tags: "",
    type: "tool",
  });
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "top">("all");
  const [posts, setPosts] = useState<any[]>([]);
  const selectedPost = posts.find((p) => p.id === selectedPostId);

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let handled = false; // To prevent double setUser/setIsLoggedIn

    // wait for redirect result, if any
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user && !handled) {
          setUser({
            uid: result.user.uid,
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          });
          setIsLoggedIn(true);
          handled = true;
          toast({
            title: `Welcome, ${result.user.displayName}! 🎉`,
            description: "You're now connected to the community.",
          });
        }
        setAuthChecked(true); // Always set this
      })
      .catch((error) => {
        setAuthChecked(true);
      });

    // real state observable
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && !handled) {
        setUser({
          uid: u.uid,
          displayName: u.displayName,
          email: u.email,
          photoURL: u.photoURL,
        });
        setIsLoggedIn(true);
        handled = true;
      } else if (!u) {
        setUser(null);
        setIsLoggedIn(false);
      }
      setAuthChecked(true); // On every invoke, at least after first
    });

    return () => unsub();
  }, [toast]);

  useEffect(() => {
    if (!isLoggedIn) return; // only fetch after login

    let q;
    if (activeTab === "top") {
      q = query(collection(db, "posts"), orderBy("likes", "desc"));
    } else {
      q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    }

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
      setPosts(data);
    });

    return () => unsub();
  }, [activeTab, isLoggedIn]); // 👈 now re-fetches when login state changes

  const lastCommentRef = useRef<HTMLDivElement | null>(null);

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
          post.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const getTypeColor = (type: string) => {
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
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // ✅ Mobile → redirect
        await signInWithRedirect(auth, googleProvider);
      } else {
        // ✅ Desktop → popup
        const result = await signInWithPopup(auth, googleProvider);
        const u = result.user;
        setUser({
          uid: u.uid,
          displayName: u.displayName,
          email: u.email,
          photoURL: u.photoURL,
        });
        setIsLoggedIn(true);
        toast({
          title: `Welcome, ${u.displayName}! 🎉`,
          description: "You're now connected to the community.",
        });
      }
    } catch (e) {
      console.error("Login error:", e);
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // 🔹 Create post
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
      // onSnapshot will refresh UI automatically
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
      setNewPost({ title: "", description: "", tags: "", type: "tool" });
      setIsCreateModalOpen(false);
    } catch (e) {
      console.error("Create post error:", e);
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive",
      });
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string | null) => {
    if (!postId) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prev) => prev.filter((p: any) => p.id !== postId));

      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    } catch (e) {
      console.error("Delete error:", e);
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

  // 🔹 Handle like

  const handleLike = async (postId: string) => {
    if (!isLoggedIn || !user?.email) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to like posts.",
      });
      return;
    }

    const current = posts.find((p: any) => p.id === postId);
    if (!current) return;

    const alreadyLiked = current.likedBy?.includes(user.email);

    // 🔹 Optimistic UI update
    const updatedLikedBy = alreadyLiked
      ? current.likedBy.filter((e: string) => e !== user.email)
      : [...(current.likedBy || []), user.email];

    const updatedLikes = updatedLikedBy.length;

    setPosts((prev) =>
      prev.map((p: any) =>
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
      console.error("Like error:", e);

      // 🔹 Rollback UI if Firestore fails
      setPosts((prev) =>
        prev.map((p: any) =>
          p.id === postId
            ? { ...p, likedBy: current.likedBy, likes: current.likes }
            : p
        )
      );
    }
  };

  // 🔹 Handle comments
  const handleAddComment = async (postId: string) => {
    if (!newComment.trim() || !user) return;

    const cleanedComment = leoProfanity.clean(newComment);

    const newCommentObj = {
      id: Date.now(),
      authorId: user.uid,
      author: user.displayName || "You",
      text: cleanedComment,
      time: new Date().toISOString(),
    };

    // Optimistic UI
    setPosts((prev) =>
      prev.map((p: any) =>
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
    } catch (e) {
      console.error("Add comment error:", e);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: number) => {
    if (!user) return;
    try {
      // 1. Get the post
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) return;

      const post = postSnap.data();
      const oldComments = post.comments || [];

      // 2. Remove only the comment with specific id (and where author == user.displayName)
      const updatedComments = oldComments.filter(
        (c: any) => !(c.id === commentId && user.uid === c.authorId)
      );

      // 3. Update Firestore
      await updateDoc(postRef, { comments: updatedComments });

      // 4. (Optional) Show toast
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
        duration: 1000,
      });
    } catch (err) {
      console.error("Error deleting comment", err);
      toast({
        title: "Error",
        description: "Unable to delete comment.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsLoggedIn(false);
      toast({ title: "Signed out", description: "You have logged out." });
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  // 🔹 Guest screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-dots-gradient bg-dots pt-10 font-outfit">
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-10 lg:px-8">
            <div className="text-center">
              <div className="p-12 max-w-2xl mx-auto">
                <img
                  src="Vector.svg"
                  className="text-primary mx-auto mb-3 animate-pulse"
                  style={{ animationDuration: "0.7s" }}
                />
                <img
                  src="OP.png"
                  className="w-60 h-30 text-primary mx-auto mb-6"
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
            <img src="Logo.png" className="w-30 h-12 text-primary" />
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
          {/* Filter Tabs */}
          <div>
            <div className="text-3xl mb-2 sm:mb-4 sm:text-4xl md:text-6xl lg:text-5xl m-5 font-light text-gray-400">
              <b className="text-white font-bold">Hello</b> {user.displayName},
            </div>

            <div className="mt-2 sm:mt-4 mx-5 flex flex-wrap items-center text-sm sm:text-base md:text-lg">
              <span>you’ve got ideas let’s make them unstoppable,</span>

              {/* Button wrapper */}
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

            {/* Show content based on tab */}
            <div>
              {activeTab === "all"}
              {activeTab === "tools"}
              {activeTab === "ideas"}
              {activeTab === "top"}
            </div>
          </div>

          {/* Posts Grid */}
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

      {/* Post Detail Modal */}
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
