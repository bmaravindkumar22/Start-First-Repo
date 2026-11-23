import Button from "./Button.jsx";
import DropZone from "./DropZone.jsx";
import JobDescriptionField from "./JobDescriptionField.jsx";

// The two inputs and the submit row. It holds no state of its own.
export default function AnalyzerForm({
    upload,
    jobDescription,
    onJobDescriptionChange,
    isLoading,
    status,
    error,
    onAnalyze,
}) {
    function handleSubmit(event) {
        event.preventDefault();
        onAnalyze();
    }

    return (
        <form onSubmit={handleSubmit} className="grid gap-10 pb-16 lg:grid-cols-2" noValidate>
            <div>
                <h2 className="font-display text-2xl font-medium">Your resume</h2>
                <div className="mt-5">
                    <DropZone
                        file={upload.file}
                        isDragging={upload.isDragging}
                        dropHandlers={upload.dropHandlers}
                        onFileSelect={upload.selectFile}
                    />
                </div>
            </div>

            <div>
                <JobDescriptionField
                    id="job-description"
                    value={jobDescription}
                    onChange={onJobDescriptionChange}
                />
            </div>

            <div className="flex flex-col items-center gap-4 text-center lg:col-span-2">
                <Button type="submit" disabled={isLoading}>
                    Check my resume
                </Button>
                <p className="text-pencil" aria-live="polite">
                    {status}
                </p>
                <p className="text-correction" role="alert">
                    {error}
                </p>
            </div>
        </form>
    );
}
