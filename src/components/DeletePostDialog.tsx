import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function DeletePostDialog({
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  handleDeletePost,
  postToDelete
}) {
  return (
    <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
      <DialogContent className="glass-dark border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Delete Post?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => setDeleteConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeletePost(postToDelete)}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default DeletePostDialog;
