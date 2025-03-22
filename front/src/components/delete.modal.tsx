import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface DeletePost {
  isPending: boolean;
}

interface DeleteModalProps {
  deleteId: string | null;
  setDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
  deletePost: DeletePost;
  handleDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  deleteId,
  setDeleteId,
  deletePost,
  handleDelete,
}) => {
  return (
    <Dialog
      open={!!deleteId}
      onOpenChange={(open) => !open && setDeleteId(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the post.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePost.isPending}
          >
            {deletePost.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
