import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

type InfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  title?: string;
  onConfirm?: () => void
};

export function InfoModal({ open, onOpenChange, message, title = "Informacja", onConfirm }: InfoModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mt-2">Zamknij</AlertDialogCancel>
          {!!onConfirm  && <AlertDialogAction
            className="mt-2"
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
          >Tak</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}