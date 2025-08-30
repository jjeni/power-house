import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SquarePen } from "lucide-react";

function CreatePostDialog({
  isOpen,
  setIsOpen,
  newPost,
  setNewPost,
  handleCreatePost,
  TITLE_LENGTH,
  DESCRIPTION_LENGTH
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="gradient"
          size="sm"
          className="fixed px-4 py-1 bottom-8 right-8 bg-white text-black font-bold rounded-xl w-55 h-14 shadow-lg hover:scale-110 transition flex items-center justify-center z-50"
        >
          <SquarePen className="w-6 h-6 text-black" />
          Start a post
        </Button>
      </DialogTrigger>

      <DialogContent className="glass-dark border-white/20 max-w-md g-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Title
            </label>
            <Input
              placeholder="Enter post title..."
              maxLength={TITLE_LENGTH}
              value={newPost.title}
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  title: e.target.value.slice(0, TITLE_LENGTH),
                })
              }
              className="glass-dark bg-black border border-white/20 text-foreground placeholder:text-muted-foreground"
            />
            <div
              className={`mt-1 text-xs text-right ${
                TITLE_LENGTH - newPost.title.length <= 15
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              Remaining Characters {TITLE_LENGTH - newPost.title.length}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Type
            </label>
            <select
              value={newPost.type}
              onChange={(e) =>
                setNewPost({ ...newPost, type: e.target.value })
              }
              className="w-full glass-dark border border-white/20 rounded-md p-2 bg-black text-foreground"
            >
              <option value="tool">Tool</option>
              <option value="idea">Idea</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description
            </label>
            <Textarea
              maxLength={DESCRIPTION_LENGTH}
              placeholder="Share your thoughts..."
              value={newPost.description}
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  description: e.target.value.slice(0, DESCRIPTION_LENGTH),
                })
              }
              className="bg-black border-white/20 min-h-[100px]"
            />
            <div
              className={`mt-1 text-xs text-right ${
                DESCRIPTION_LENGTH - newPost.description.length <= 100
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              Remaining Characters{" "}
              {DESCRIPTION_LENGTH - newPost.description.length}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tags
            </label>
            <Input
              maxLength={30}
              placeholder="ai, machine-learning, tools (comma separated)"
              value={newPost.tags}
              onChange={(e) =>
                setNewPost({
                  ...newPost,
                  tags: e.target.value.slice(0, 30),
                })
              }
              className="bg-black border-white/20"
            />
            <div
              className={`mt-1 text-xs text-right ${
                30 - newPost.tags.length <= 10
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              Remaining Characters {30 - newPost.tags.length}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="flex-1 hover:bg-red-900 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleCreatePost}
              className="flex-1 bg-white text-black font-bold"
              disabled={!newPost.title || !newPost.description}
            >
              Create Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePostDialog;