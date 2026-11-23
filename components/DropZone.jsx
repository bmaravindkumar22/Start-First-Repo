import { useRef } from "react";

// A box that takes a dropped file or a file picked with a button.
// The parent owns the state; this component only shows it and reports changes.
export default function DropZone({ file, isDragging, dropHandlers, onFileSelect }) {
    const inputRef = useRef(null);

    return (
        <div
            className="drop-zone flex h-80 flex-col items-center justify-center gap-4 border border-dashed border-white/25 p-8 text-center"
            data-dragging={isDragging ? "true" : undefined}
            {...dropHandlers}
        >
            <p className="text-pencil">Drop a PDF or .docx here</p>
            <button type="button" onClick={() => inputRef.current?.click()} className="border-b border-bone pb-0.5">
                Or choose a file
            </button>
            <p className="text-sm text-pencil">{file ? file.name : "No file yet"}</p>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                hidden
                onChange={(event) => {
                    onFileSelect(event.target.files[0]);
                    // Clear the input so picking the same file again still fires onChange.
                    event.target.value = "";
                }}
            />
        </div>
    );
}
