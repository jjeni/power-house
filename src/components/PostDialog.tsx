import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, MessageCircle, Trash, Send } from "lucide-react";
import Linkify from "linkify-react";
import FireLogo from "@/pages/Svg";
import { formatDate, getTypeColor } from "@/lib/utils"; // adjust import
import { useState } from "react";

type PostDialogProps = {
  selectedPost: any | null;
  user: any;
  isPowering: boolean;
  newComment: string;
  inputRef: React.RefObject<HTMLInputElement>;
  lastCommentRef: React.RefObject<HTMLDivElement>;
  COMMENT_LENGTH: number;
  onClose: () => void;
  onLike: (id: string) => Promise<void>;
  onAddComment: (id: string) => void;
  setNewComment: (val: string) => void;
  setPostToDelete: (id: string) => void;
  setDeleteConfirmOpen: (val: boolean) => void;
  setCommentToDelete: (id: number) => void;
};

const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

export default function PostDialog({
  selectedPost,
  user,
  isPowering,
  newComment,
  inputRef,
  lastCommentRef,
  COMMENT_LENGTH,
  onClose,
  onLike,
  onAddComment,
  setNewComment,
  setPostToDelete,
  setDeleteConfirmOpen,
  setCommentToDelete,
}: PostDialogProps) {
  return (
    <Dialog open={!!selectedPost} onOpenChange={onClose}>
      <DialogContent className="glass-dark border-white/20 max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-black scrollbar-rounded-full overflow-x-hidden g-background/95 backdrop-blur-xl">
        {selectedPost && (
          <>
            {/* ---------- HEADER ---------- */}
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    <img
                      src={selectedPost.photoURL || "/default-avatar.png"}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-left text-foreground">
                      {selectedPost.author}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {formatDate(selectedPost.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              <DialogTitle className="text-2xl pr-10 font-bold text-foreground text-left flex items-center gap-2 break-words">
                <div className="flex items-center gap-3">
                  <span>{selectedPost.title}</span>
                  <Badge
                    className={`inline-block text-xs px-2 py-1 border ${getTypeColor(
                      selectedPost.type
                    )} rounded-full`}
                  >
                    {selectedPost.type}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>

            {/* ---------- BODY ---------- */}
            <div className="space-y-6">
              {/* Description */}
              <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words min-w-0 ">
                <Linkify options={{ target: "_blank" }}>
                  <span
                    className="[&>a]:break-all [&_a]:whitespace-normal [&_a]:break-words [&>a]:text-blue-400 [&>a]:underline"
                    style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                  >
                    {selectedPost.description}
                  </span>
                </Linkify>
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Like + Comment Buttons */}
              <div className="flex items-center justify-between gap-6 py-4 border-y border-white/10">
                <div className="flex items-center gap-6">
                  {/* Like */}
                  <Button
                    size="sm"
                    onClick={async () => await onLike(selectedPost.id)}
                    className={`group flex items-center gap-2 bg-transparent border-none shadow-none p-0 
                      transition-colors duration-150 ${
                        selectedPost.likedBy?.includes(user?.email)
                          ? "text-[#A66EFF] hover:bg-transparent"
                          : "text-muted-foreground hover:bg-transparent"
                      }`}
                  >
                    <span
                      className={`transition-transform duration-300 bg-transparent
                        ${isPowering ? "animate-fire-pop " : ""}
                        ${
                          selectedPost.likedBy?.includes(user?.email)
                            ? "text-[#A66EFF]"
                            : ""
                        }
                        group-hover:drop-shadow-[0_0_12px_#A66EFF88] 
                        group-hover:animate-fire-flicker
                      `}
                      style={{ display: "inline-flex", fontSize: 28 }}
                    >
                      <FireLogo
                        fill={
                          selectedPost.likedBy?.includes(user?.email)
                            ? "#A66EFF"
                            : "none"
                        }
                        stroke={
                          selectedPost.likedBy?.includes(user?.email)
                            ? "#A66EFF"
                            : "#AAA"
                        }
                      />
                    </span>
                    {selectedPost.likedBy?.length || 0} Powers
                  </Button>

                  {/* Comment Button */}
                  <Button
                    className="hover:bg-transparent bg-transparent"
                    onClick={() => inputRef.current?.focus()}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm">
                      <MessageCircle className="w-4 h-4" />
                      {selectedPost.comments.length} comments
                    </div>
                  </Button>
                </div>

                {/* Delete Post */}
                {selectedPost?.authorId === user?.uid && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setPostToDelete(selectedPost.id);
                      setDeleteConfirmOpen(true);
                    }}
                  >
                    <Trash />
                  </Button>
                )}
              </div>

              {/* ---------- COMMENTS ---------- */}
              <div className="space-y-4 break-anywhere">
                <h3 className="font-semibold text-foreground">Comments</h3>

                {selectedPost.comments.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPost.comments.map((comment: any, idx: number) => (
                      <div
                        key={comment.id}
                        ref={
                          idx === selectedPost.comments.length - 1
                            ? lastCommentRef
                            : null
                        }
                        className="bg-muted/20 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {comment.author.charAt(0)}
                          </div>
                          <span className="font-medium text-sm text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.time)}
                          </span>

                          {user?.uid === comment.authorId && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setCommentToDelete(comment.id)}
                              className="ml-auto hover:bg-transparent text-red-500 hover:text-red-700"
                              title="Delete your comment"
                            >
                              <Trash />
                            </Button>
                          )}
                        </div>
                        <p className="text-foreground text-sm leading-relaxed break-all whitespace-pre-wrap">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No comments yet. Be the first to comment!
                  </p>
                )}

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    maxLength={150}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onAddComment(selectedPost.id);
                      }
                    }}
                    className="Commentc bg-muted/30 border-white/20 flex-1"
                  />
                  <Button
                    variant="gradient"
                    className="bg-white"
                    onClick={() => onAddComment(selectedPost.id)}
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div
                  className={`text-xs text-left ${
                    COMMENT_LENGTH - newComment.length <= 50
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  Remaining Characters {COMMENT_LENGTH - newComment.length}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
