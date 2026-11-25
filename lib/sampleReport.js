// A fixed example of what analyze() returns, shown on the landing page before anyone
// checks a resume. It is for a made-up frontend resume and posting, so the numbers
// keep the same shape as a real report: the overall score is the weighted sum of the
// three breakdown values (0.6 / 0.2 / 0.2), rounded.
export const sampleReport = {
    overall: 70,
    message: "Good start. Close the missing terms to improve your odds.",
    breakdown: [
        { name: "Job keywords", value: 70 },
        { name: "Sections", value: 80 },
        { name: "Measurable results", value: 60 },
    ],
    matched: ["react", "tailwind", "git", "testing", "communication"],
    missing: ["typescript", "docker", "ci/cd", "jest"],
    strengths: [
        "Your resume shows 5 of the 9 terms this posting uses.",
        "Your resume has every section recruiters look for.",
        "3 measurable figures give the reader proof of results.",
    ],
    weaknesses: [
        "Add typescript, docker, ci/cd and jest if you have used them. Use the posting's exact wording.",
        "No contact details section found.",
    ],
    stats: { wordCount: 412, metricCount: 3 },
};
