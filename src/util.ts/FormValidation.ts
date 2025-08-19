export type FormValidationProps = {
    lesson: string;
    time: string;
    category: string;
    status: string;
}


export default function formValidation(data: FormValidationProps) {
    const newErrors: Record<string, string> = {};

    if (!data.lesson.trim()) {
        newErrors.lesson = 'Lesson is required';
    }
    if (!data.time || Number(data.time) <= 0) {
        newErrors.time = 'Time must be greater than 0';
    }
    if (!data.category) {
        newErrors.category = 'Category is required';
    }
    if (!data.status) {
        newErrors.status = 'Status is required';
    }

    return newErrors;
}
