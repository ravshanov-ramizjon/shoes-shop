import {
    FiXCircle,
  } from "react-icons/fi"
  import { Button } from "@/components/ui/button"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
export default function CancelOrderDialog({
    orderId,
    onConfirm,
  }: {
    orderId: string
    onConfirm: (orderId: string) => void
  }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_12px_red] hover:shadow-[0_0_18px_red] transition"
          >
            <FiXCircle />
            Отменить
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-gray-900 border border-cyan-400 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Отмена заказа</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить этот заказ? Это действие нельзя
              отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
            className="bg-gray-900 border-cyan-400 text-cyan-400 hover:text-black hover:drop-shadow-[0_0_20px_cyan] hover:bg-cyan-500"
            >Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onConfirm(orderId)}
              className="bg-red-600 hover:bg-red-500"
            >
              Отменить заказ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }