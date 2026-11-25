import { useEffect, useRef } from "react";
import ScoreBlock from "./ScoreBlock.jsx";
import BreakdownBars from "./BreakdownBars.jsx";
import TermList from "./TermList.jsx";
import NoteList from "./NoteList.jsx";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";

// The full report. It takes focus and scrolls into view each time a new report arrives.
export default function Scorecard({ report, demo = false }) {
    const ref = useRef(null);
    const reduceMotion = usePrefersReducedMotion();

    useEffect(() => {
        // The sample on the landing page stays where it is; only a real result takes focus.
        if (demo) return;
        ref.current?.focus({ preventScroll: true });
        ref.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, [report, reduceMotion]);

    return (
        <section
            ref={ref}
            tabIndex={-1}
            aria-labelledby="scorecard-title"
            className="scorecard border-t border-white/10 pt-12 pb-24"
        >
            <h2 id="scorecard-title" className="font-display text-4xl font-medium">
                Your scorecard
            </h2>

            {demo && (
                <p className="mt-4 max-w-[60ch] text-pencil">
                    A sample for a made-up resume. Check yours above to replace it with your own result.
                </p>
            )}

            <div className="mt-12 grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
                <ScoreBlock overall={report.overall} message={report.message} stats={report.stats} />
                <BreakdownBars items={report.breakdown} />
            </div>

            <div className="mt-16 grid gap-12 sm:grid-cols-2">
                <TermList title="Found on your resume" items={report.matched} emptyText="None of the posting's terms were found." />
                <TermList
                    title="Missing from your resume"
                    items={report.missing}
                    emptyText="Nothing important is missing."
                    tone="missing"
                />
                <NoteList title="Strengths" items={report.strengths} emptyText="No clear strengths found." />
                <NoteList title="Weaknesses" items={report.weaknesses} emptyText="No major weaknesses found." />
            </div>
        </section>
    );
}
