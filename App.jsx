import { useEffect, useState } from "react";
import Button from "./components/Button.jsx";
import UploadCard from "./components/UploadCard.jsx";
import JobCard from "./components/JobCard.jsx";
import Results from "./components/Results.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import useFileUpload from "./hooks/useFileUpload.js";
import useResumeAnalysis from "./hooks/useResumeAnalysis.js";

// The page is composed here. Each hook owns one job, and the components only render.
export default function App() {
    const [jobDescription, setJobDescription] = useState("");
    const upload = useFileUpload();
    const analysis = useResumeAnalysis();

    // Light mode is a class on <html>. The colour variables in index.css switch on that class.
    const [isLight, setIsLight] = useState(false);
    useEffect(() => {
        document.documentElement.classList.toggle("light", isLight);
    }, [isLight]);

    // Only shown as a hint. Errors appear after the user tries to analyze, never on load.
    const isReady = Boolean(upload.file) && jobDescription.trim().length > 0;

    function handleSubmit(event) {
        event.preventDefault();
        analysis.run(upload.file, jobDescription);
    }

    return (
        <div className="min-h-screen">
            <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
                <p className="text-lg font-semibold tracking-tight">ResumeMatch</p>
                <ThemeToggle isLight={isLight} onChange={setIsLight} />
            </header>

            <main className="mx-auto max-w-5xl px-5">
                <section className="pt-10 pb-10 sm:pt-16">
                    <h1 className="max-w-[24ch] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                        See how your resume matches the job
                    </h1>
                    <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted">
                        Upload your resume and paste the job description to find matching skills and areas to
                        improve.
                    </p>
                </section>

                <form onSubmit={handleSubmit} noValidate className="grid gap-6 md:grid-cols-2">
                    <UploadCard upload={upload} />
                    <JobCard value={jobDescription} onChange={setJobDescription} />

                    <div className="flex flex-col gap-3 md:col-span-2">
                        <Button type="submit" disabled={analysis.isLoading} className="w-full sm:w-auto">
                            {analysis.isLoading ? "Analyzing your resume…" : "Analyze my resume"}
                        </Button>

                        {analysis.error ? (
                            <p role="alert" className="text-danger">
                                {analysis.error}
                            </p>
                        ) : (
                            !isReady && (
                                <p className="text-muted">Add your resume and job description to continue.</p>
                            )
                        )}

                        <p aria-live="polite" className="text-sm text-muted">
                            {analysis.status}
                        </p>
                    </div>
                </form>

                <Results report={analysis.report} />
            </main>

            <footer className="mx-auto max-w-5xl border-t border-line/10 px-5 py-8 text-sm text-muted">
                Your file is read in this browser. Nothing is uploaded or stored.
            </footer>
        </div>
    );
}
