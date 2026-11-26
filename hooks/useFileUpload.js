import { useCallback, useRef, useState } from "react";
import { ACCEPTED_EXTENSIONS, MAX_FILE_BYTES } from "../lib/constants.js";

// Holds the chosen resume and checks it before it is used.
// Returns handlers for drag and drop, so the drop zone stays a plain component.
export default function useFileUpload() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    // Dragging over a child element fires dragleave on the parent too. Counting
    // enters and leaves keeps the highlight steady as the pointer crosses children.
    const dragDepth = useRef(0);

    const selectFile = useCallback((candidate) => {
        setError("");
        if (!candidate) return;

        const name = candidate.name.toLowerCase();
        if (!ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
            setError("That file type is not supported. Upload a PDF or a .docx file.");
            return;
        }
        if (candidate.size > MAX_FILE_BYTES) {
            setError("That file is over 5 MB. Upload a smaller copy.");
            return;
        }
        setFile(candidate);
    }, []);

    // Clears the chosen file, so the upload card returns to its empty state.
    const removeFile = useCallback(() => {
        setFile(null);
        setError("");
    }, []);

    const dropHandlers = {
        onDragEnter(event) {
            event.preventDefault();
            dragDepth.current += 1;
            setIsDragging(true);
        },
        onDragOver(event) {
            event.preventDefault();
        },
        onDragLeave(event) {
            event.preventDefault();
            dragDepth.current -= 1;
            if (dragDepth.current <= 0) {
                dragDepth.current = 0;
                setIsDragging(false);
            }
        },
        onDrop(event) {
            event.preventDefault();
            dragDepth.current = 0;
            setIsDragging(false);
            selectFile(event.dataTransfer.files[0]);
        },
    };

    return { file, error, isDragging, selectFile, removeFile, dropHandlers };
}
