import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function DeleteCommentDialog({
  commentToDelete,
  setCommentToDelete,
  handleDeleteComment,
  selectedPost
}) {
  return (
    <Dialog
      open={commentToDelete !== null}
      onOpenChange={(val) => !val && setCommentToDelete(null)}
    >
      <DialogContent className="glass-dark border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Delete Comment?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Are you sure you want to delete your comment? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setCommentToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              handleDeleteComment(selectedPost.id, commentToDelete);
              setCommentToDelete(null);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteCommentDialog;