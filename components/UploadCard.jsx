import { useRef } from "react";
import Button from "./Button.jsx";

// Step 1. Drop a file here or choose one. After a file is held, its name shows with
// Replace and Remove. The parent owns the state (useFileUpload); this only shows it.
export default function UploadCard({ upload }) {
    const inputRef = useRef(null);
    const { file, error, isDragging, selectFile, removeFile, dropHandlers } = upload;

    function openPicker() {
        inputRef.current?.click();
    }

    return (
        <section aria-labelledby="upload-title" className="orange-box flex min-w-0 flex-col rounded-xl bg-surface p-6">
            <h2 id="upload-title" className="text-lg font-semibold">
                1. Upload resume
            </h2>

            <div
                {...dropHandlers}
                className={`mt-5 flex min-h-56 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center ${isDragging ? "border-solid border-accent bg-accent/10" : "border-line/20"
                    }`}
            >
                {file ? (
                    <>
                        <p className="max-w-full break-all font-medium">{file.name}</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-3">
                            <Button variant="secondary" onClick={openPicker}>
                                Replace
                            </Button>
                            <Button variant="secondary" onClick={removeFile}>
                                Remove
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="font-medium">Drag your resume here</p>
                        <Button variant="secondary" onClick={openPicker}>
                            Choose file
                        </Button>
                        <p className="text-sm text-muted">PDF or DOCX</p>
                    </>
                )}
            </div>

            {error && (
                <p role="alert" className="mt-4 text-sm text-danger">
                    {error}
                </p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                hidden
                onChange={(event) => {
                    selectFile(event.target.files[0]);
                    // Clear the input so picking the same file again still fires onChange.
                    event.target.value = "";
                }}
            />
        </section>
    );
}
