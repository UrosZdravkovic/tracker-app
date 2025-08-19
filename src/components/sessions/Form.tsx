import { type FormEvent, useState } from 'react';
import formValidation, { type FormValidationProps } from '../../util.ts/FormValidation';
import styles from './Form.module.css';
import { type Session } from "../../store/sessions-context";
import { useAuth } from '../../store/auth-context';
import Spinner from '../../uiLoaders/Spinner';
import CustomDropdown from '../ui/CustomDropdown'; // <-- import the custom dropdown

type FormProps = {
    onClose: () => void;
    addSession?: (session: Session) => Promise<void>;
    updateSession?: (sessionId: string, updatedData: Partial<Session>) => Promise<void>;
    sessionToEdit?: Session | null;
}

export default function Form({ onClose, addSession, updateSession, sessionToEdit }: FormProps) {
    const { user } = useAuth();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Local state for custom dropdowns
    const [category, setCategory] = useState(sessionToEdit?.category ?? "");
    const [status, setStatus] = useState(sessionToEdit?.status ?? "");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as FormValidationProps;

        // Overwrite with controlled dropdown values
        data.category = category;
        data.status = status;

        const validationErrors = formValidation(data);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        try {
            if (sessionToEdit && updateSession) {
                await updateSession(sessionToEdit.id, {
                    lesson: data.lesson,
                    time: Number(data.time),
                    category: data.category,
                    status: data.status,
                });
            } else if (addSession) {
                const newSession: Session = {
                    id: crypto.randomUUID(),
                    lesson: data.lesson,
                    time: Number(data.time),
                    category: data.category,
                    status: data.status,
                    userId: user?.uid as string
                };
                await addSession(newSession);
            }

            onClose();
        } catch (error) {
            console.error("Failed to save session:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1>{sessionToEdit ? "Edit Session" : "Add Session"}</h1>
            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label htmlFor="lesson" className={styles.label}>Title</label>
                    <input
                        type="text"
                        id="lesson"
                        name="lesson"
                        defaultValue={sessionToEdit?.lesson ?? ""}
                        placeholder='React Native'
                        className={`${styles.input} ${errors.lesson ? styles.inputError : ""}`}
                    />
                    {errors.lesson && <span className={styles.errorText}>{errors.lesson}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="time" className={styles.label}>Time spent:</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="number"
                            id="time"
                            name="time"
                            min={0}
                            defaultValue={sessionToEdit?.time ?? ''}
                            placeholder='0'
                            className={`${styles.input} ${errors.time ? styles.inputError : ""}`}
                        />
                        <span className={styles.unit}>min</span>
                    </div>
                    {errors.time && <span className={styles.errorText}>{errors.time}</span>}
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <CustomDropdown
                        options={[
                            { value: "", label: "Select..." },
                            { value: "reading", label: "Reading" },
                            { value: "coding", label: "Coding" },
                            { value: "review", label: "Review" },
                        ]}
                        value={category}
                        onChange={setCategory}
                        label="Category"
                        name="category"
                        error={errors.category}
                    />
                </div>

                <div className={styles.formGroup}>
                    <CustomDropdown
                        options={[
                            { value: "", label: "Select..." },
                            { value: "started", label: "Started" },
                            { value: "in progress", label: "In Progress" },
                            { value: "completed", label: "Completed" },
                        ]}
                        value={status}
                        onChange={setStatus}
                        label="Progress"
                        name="status"
                        error={errors.status}
                    />
                </div>
            </div>

            <div className={styles.buttonGroup}>
                <button type="submit" disabled={isLoading} className={`${styles.button} ${styles.submitButton}`}>
                    {isLoading ? <Spinner size={14} text={true} /> : sessionToEdit ? 'Update Session' : 'Add Session'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className={`${styles.button} ${styles.cancelButton}`}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}