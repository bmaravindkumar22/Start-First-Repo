import { useEffect, useRef } from "react";
import { sampleReport } from "../lib/sampleReport.js";

// Says what the score measures, so it is not read as a prediction of an interview or a hire.
const SCORE_NOTE =
    "This score measures how much of the posting's keywords, sections and figures your resume covers. It does not predict an interview or an employer's decision.";

// A bar with its value written out as text, so the number is never shown by colour or length alone.
function Meter({ label, value }) {
    return (
        <div>
            <div className="flex items-baseline justify-between gap-4 text-sm">
                <span>{label}</span>
                <span className="tabular-nums text-muted">{value} / 100</span>
            </div>
            <div
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={value}
                className="mt-2 h-2 rounded-full bg-line/10"
            >
                <div className="h-2 rounded-full bg-accent" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}

// A titled list. Use ordered only when the order means something, such as priority.
function ItemList({ title, items, emptyText, ordered = false }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-muted">{title}</h3>
            {items.length === 0 ? (
                <p className="mt-3">{emptyText}</p>
            ) : ordered ? (
                <ol className="mt-3 grid list-decimal gap-3 pl-5">
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ol>
            ) : (
                <ul className="mt-3 grid gap-3">
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// The full report. The same layout shows a real result and the labelled example.
function Report({ report, title, titleId }) {
    return (
        <div>
            <h2 id={titleId} className="text-2xl font-semibold tracking-tight">
                {title}
            </h2>

            <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
                <div>
                    <p className="text-sm text-muted">Resume match score</p>
                    <p className="mt-1 text-6xl font-semibold tabular-nums">
                        {report.overall}
                        <span className="text-2xl font-normal text-muted"> / 100</span>
                    </p>
                    <div className="mt-5">
                        <Meter label="Overall" value={report.overall} />
                    </div>
                    <p className="mt-6 text-lg leading-relaxed">{report.message}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{SCORE_NOTE}</p>
                </div>

                <div className="grid content-start gap-6">
                    {report.breakdown.map((item) => (
                        <Meter key={item.name} label={item.name} value={item.value} />
                    ))}
                </div>
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
                <ItemList
                    title="Matched skills"
                    items={report.matched}
                    emptyText="None of the posting's terms were found."
                />
                <ItemList
                    title="Missing keywords"
                    items={report.missing}
                    emptyText="Nothing important is missing."
                />
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
                <ItemList
                    title="Suggestions, in priority order"
                    items={report.weaknesses}
                    emptyText="No major weaknesses found."
                    ordered
                />
                <ItemList title="What's working" items={report.strengths} emptyText="No clear strengths found." />
            </div>
        </div>
    );
}

// Step 4. Before a check, the empty state explains what will appear. The example is clearly
// labelled, so it is never mistaken for the reader's own result.
export default function Results({ report }) {
    const ref = useRef(null);

    // A new report takes focus and scrolls into view. It is not done on the empty state,
    // so the page does not jump to the example on load.
    useEffect(() => {
        if (!report) return;
        ref.current?.focus({ preventScroll: true });
        ref.current?.scrollIntoView({ block: "start" });
    }, [report]);

    return (
        <section ref={ref} tabIndex={-1} aria-labelledby="results-title" className="mt-16 pb-24 outline-none">
            {report ? (
                <Report report={report} title="Your results" titleId="results-title" />
            ) : (
                <>
                    <h2 id="results-title" className="text-2xl font-semibold tracking-tight">
                        Your results will appear here
                    </h2>
                    <p className="mt-3 text-muted">Add both documents to see your match and suggestions.</p>

                    <div className="mt-16 border-t border-line/10 pt-12">
                        <p className="mb-8 text-sm text-muted">
                            A made-up resume and posting, shown to explain the layout. It is not your result.
                        </p>
                        <Report report={sampleReport} title="Example results" titleId="example-title" />
                    </div>
                </>
            )}
        </section>
    );
}
