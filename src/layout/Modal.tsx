import { forwardRef, type ReactNode, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

import styles from './Modal.module.css'

export type ModalHandle = { 
    open: () => void;
}

type ModalProps = {
    children: ReactNode;
    onClose: () => void
}


const Modal = forwardRef<ModalHandle, ModalProps>(function Modal({children, onClose}, ref) {

    const dialog = useRef<HTMLDialogElement>(null);

  // useImperativeHandle is used to expose the `open` method to other components
  useImperativeHandle(ref, () => {
    return {
      open: () => {
        if (dialog.current) {
          dialog.current.showModal(); // showModal() is a built-in method available on the <dialog> element
        }
      },
    };
  });

  // Below, the onClose prop is set on <dialog> to handle the case that the user closes the modal via a built-in mechanism (ESC key)
  return createPortal(
    <dialog ref={dialog} className={styles.modal} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal-root')!
  );
})



export default Modal;


