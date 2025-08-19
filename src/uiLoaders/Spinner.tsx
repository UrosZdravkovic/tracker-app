import { ClipLoader } from "react-spinners";

type SpinnerProps = {
    size: number;
    text: boolean
}

export default function Spinner({size, text}: SpinnerProps) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ClipLoader size={size} color="#2563eb" />
            {text ? <span>Loading...</span> : ''}
            
        </div>
    );
}