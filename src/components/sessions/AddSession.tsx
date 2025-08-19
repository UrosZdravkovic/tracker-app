import { useRef, useEffect } from "react"

import Modal, { type ModalHandle } from "../../layout/Modal"

import Form from "./Form";
import { useSessionsCtx } from "../../store/sessions-context";
import { type Session } from "../../store/sessions-context";

type AddSessionProps = {
    onClose: () => void;
}

export default function AddSession({ onClose }: AddSessionProps) {

    const sessionsCtx = useSessionsCtx();

    const modal = useRef<ModalHandle>(null);

    useEffect(() => {
        if (modal.current) {
            modal.current.open();
        }
    }, [])

    const handleAddSessions = (session: Session): Promise<void> => {
        return sessionsCtx.addSession(session);
    };


    return (
        <Modal ref={modal} onClose={onClose}>
            <Form onClose={onClose} addSession={handleAddSessions} />
        </Modal>
    )
}