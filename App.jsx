import { useState } from "react";
import Hero from "./components/Hero.jsx";
import AnalyzerForm from "./components/AnalyzerForm.jsx";
import Scorecard from "./components/Scorecard.jsx";
import Footer from "./components/Footer.jsx";
import useFileUpload from "./hooks/useFileUpload.js";
import useResumeAnalysis from "./hooks/useResumeAnalysis.js";

// The page is composed here. Each hook owns one job, and the components only render.
export default function App() {
    const [jobDescription, setJobDescription] = useState("");
    const upload = useFileUpload();
    const analysis = useResumeAnalysis();

    return (
        <>
            <main className="mx-auto max-w-5xl px-6">
                <Hero />

                <AnalyzerForm
                    upload={upload}
                    jobDescription={jobDescription}
                    onJobDescriptionChange={setJobDescription}
                    isLoading={analysis.isLoading}
                    status={analysis.status}
                    error={upload.error || analysis.error}
                    onAnalyze={() => analysis.run(upload.file, jobDescription)}
                />

                {analysis.report && <Scorecard report={analysis.report} />}
            </main>

            <Footer />
        </>
    );
}
