import { useCallback, useState } from "react";
import { analyze, MIN_JD_CHARS } from "../lib/analyze.js";
import { readResumeText } from "../lib/readResumeText.js";

// Runs the whole check: validate the inputs, read the file, score it.
// The UI only calls run() and renders what comes back.
export default function useResumeAnalysis() {
    const [report, setReport] = useState(null);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const run = useCallback(async (file, jobDescription) => {
        setError("");

        if (!file) {
            setError("Add your resume first. Drop a PDF or .docx above.");
            return;
        }
        if (jobDescription.trim().length < MIN_JD_CHARS) {
            setError("The job description is too short. Paste the full posting.");
            return;
        }

        setIsLoading(true);
        try {
            setStatus("Reading your resume…");
            const text = await readResumeText(file);

            setStatus("Comparing it with the posting…");
            setReport(analyze(text, jobDescription));
            setStatus("Your scorecard is below.");
        } catch (caught) {
            setReport(null);
            setStatus("");
            setError(caught.message || "Something went wrong reading that file. Try a different copy.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { report, error, status, isLoading, run };
}
