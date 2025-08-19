import { useSessionsCtx } from "../../store/sessions-context";
import Modal, { type ModalHandle } from "../../layout/Modal";
import { useRef, useEffect } from "react";
import Form from "./Form";
import { type Session } from "../../store/sessions-context";

type EditSessionProps = {
    onClose: () => void;
    session: Session;
}

export default function EditSession({ onClose, session }: EditSessionProps) {
    const modal = useRef<ModalHandle>(null);
    const sessionsCtx = useSessionsCtx();

    useEffect(() => {
        if (modal.current) {
            modal.current.open();
        }
    }, []);

    return (
        <Modal ref={modal} onClose={onClose}>
            <Form
                onClose={onClose}
                sessionToEdit={session}
                updateSession={sessionsCtx.updateSession}
            />
        </Modal>
    );
}