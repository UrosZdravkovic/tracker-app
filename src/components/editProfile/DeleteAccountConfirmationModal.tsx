import { useEffect, useRef } from "react"
import Modal, { type ModalHandle } from "../../layout/Modal"
import { Button } from "../ui/button"
import Spinner from "../../uiLoaders/Spinner"

type DeleteAccountModalProps = {
  handleClose: () => void
  handleDeleteAccount: () => void
  isDeleting: boolean
}

export default function DeleteAccountConfirmationModal({
  handleClose,
  handleDeleteAccount,
  isDeleting
}: DeleteAccountModalProps) {
  const modal = useRef<ModalHandle>(null)

  useEffect(() => {
    if (modal.current) {
      modal.current.open()
    }
  }, [])

  return (
    <Modal onClose={handleClose} ref={modal}>
      <div className="w-full max-w-md p-6 bg-background rounded-xl shadow-lg text-center space-y-6">
        <h2 className="text-xl font-semibold">Are you absolutely sure?</h2>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button variant="outline" onClick={handleClose}>
            No, cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount} className="hover:bg-red-700">
            {isDeleting ? <Spinner text={true} size={14} /> : 'Yes, delete!'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
