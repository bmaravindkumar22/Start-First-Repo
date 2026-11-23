// Matching logic for the resume checker. It takes plain text from a resume and
// a job posting and returns a report. It has no DOM code, so it can be tested
// on its own.

export const MIN_JD_CHARS = 30;
export const MIN_RESUME_CHARS = 50;

// Known skills and tools. A term from this list counts double in the score.
const SKILLS = [
    "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby",
    "sql", "html", "css", "react", "vue", "angular", "next.js", "node.js", "express", "django",
    "flask", "spring", "rest", "rest api", "graphql", "api", "docker", "kubernetes", "aws", "azure",
    "gcp", "git", "ci/cd", "linux", "mongodb", "postgresql", "mysql", "redis", "tailwind", "testing",
    "jest", "agile", "scrum", "machine learning", "data analysis", "excel", "figma", "microservices",
    "terraform", "communication", "leadership", "problem solving", "teamwork",
];

// Common words that carry no meaning for matching.
const STOPWORDS = new Set(
    `a an and are as at be been being by can could do does for from has have had in into is it
   its of on or our out over that the their them there these this those to was we were what when
   which who will with would you your job role work working team teams experience experienced years
   year ability strong good great excellent plus including include includes using use new join
   looking about across within other etc responsibilities requirements required preferred nice
   knowledge understanding ideal candidate must should may also such any all each more most
   related make help build we're you're`.split(/\s+/)
);

// Each check looks for a section heading or detail that a complete resume usually has.
// Tests run on lowercased text.
const SECTION_CHECKS = [
    { name: "Experience", test: (t) => /\b(experience|work history|employment)\b/.test(t) },
    { name: "Education", test: (t) => /\b(education|university|college|bachelor|master|degree)\b/.test(t) },
    { name: "Skills", test: (t) => /\b(skills?|technologies|tech stack)\b/.test(t) },
    { name: "Projects", test: (t) => /\bprojects?\b/.test(t) },
    { name: "Contact details", test: (t) => /[\w.+-]+@[\w-]+\.[\w.]+/.test(t) || /\+?\d[\d\s-]{8,}\d/.test(t) },
];

// Numbers that show measurable results, such as "40%", "$2M", "3x" or "10k users".
const METRIC_PATTERN =
    /\d+(\.\d+)?\s?%|\$\s?\d[\d,.]*|\b\d+(\.\d+)?\s?(x|k|m|million|billion|users|customers|requests|ms|seconds|hours)\b/gi;

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Matches a whole term, so "java" does not match inside "javascript".
// The lookarounds work where \b fails, such as after "c++" or "c#".
function hasTerm(text, term) {
    return new RegExp(`(?<![a-z0-9])${escapeRegex(term)}(?![a-z0-9])`).test(text);
}

// The most frequent meaningful words in the posting that are not known skills.
function postingWords(jobLower, limit = 8) {
    const counts = new Map();
    for (const word of jobLower.match(/[a-z][a-z'-]{3,}/g) ?? []) {
        if (STOPWORDS.has(word) || SKILLS.includes(word)) continue;
        counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([word]) => word);
}

function scoreMessage(score) {
    if (score >= 75) return "Strong match. Apply, and keep the wording close to the posting.";
    if (score >= 50) return "Good start. Close the missing terms to improve your odds.";
    return "Weak match. Most of what this posting asks for is not on your resume.";
}

function joinList(items) {
    if (items.length <= 1) return items.join("");
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function analyze(resumeText, jobText) {
    const resume = resumeText.replace(/\s+/g, " ").trim();
    const job = jobText.replace(/\s+/g, " ").trim();

    if (job.length < MIN_JD_CHARS) {
        throw new Error("The job description is too short. Paste the full posting.");
    }
    if (resume.length < MIN_RESUME_CHARS) {
        throw new Error("We could not read enough text from this file. Try a text-based PDF or a .docx.");
    }

    const resumeLower = resume.toLowerCase();
    const jobLower = job.toLowerCase();

    // Each term the posting uses, with a weight: known skills count double.
    const terms = [
        ...SKILLS.filter((skill) => hasTerm(jobLower, skill)).map((term) => ({ term, weight: 2 })),
        ...postingWords(jobLower).map((term) => ({ term, weight: 1 })),
    ];
    if (terms.length === 0) {
        throw new Error("No job terms were found in the posting. Paste the requirements too.");
    }

    const found = terms.filter((t) => hasTerm(resumeLower, t.term));
    const missing = terms
        .filter((t) => !found.includes(t))
        .sort((a, b) => b.weight - a.weight);

    const totalWeight = terms.reduce((sum, t) => sum + t.weight, 0);
    const foundWeight = found.reduce((sum, t) => sum + t.weight, 0);
    const keywords = Math.round((foundWeight / totalWeight) * 100);

    const passed = SECTION_CHECKS.filter((check) => check.test(resumeLower));
    const absent = SECTION_CHECKS.filter((check) => !check.test(resumeLower));
    const sections = Math.round((passed.length / SECTION_CHECKS.length) * 100);

    const metricCount = (resume.match(METRIC_PATTERN) ?? []).length;
    const measurable = Math.min(100, Math.round((metricCount / 5) * 100));

    const overall = Math.round(0.6 * keywords + 0.2 * sections + 0.2 * measurable);
    const wordCount = resume.split(" ").filter(Boolean).length;

    const strengths = [];
    if (found.length) {
        strengths.push(`Your resume shows ${found.length} of the ${terms.length} terms this posting uses.`);
    }
    if (passed.length === SECTION_CHECKS.length) {
        strengths.push("Your resume has every section recruiters look for.");
    }
    if (metricCount >= 3) {
        strengths.push(`${metricCount} measurable figures give the reader proof of results.`);
    }
    if (strengths.length === 0) {
        strengths.push("No clear strengths found. Add more detail on your experience.");
    }

    const weaknesses = [];
    const missingSkills = missing.filter((t) => t.weight === 2).map((t) => t.term);
    if (missingSkills.length) {
        weaknesses.push(`Add ${joinList(missingSkills)} if you have used them. Use the posting's exact wording.`);
    }
    if (absent.length) {
        weaknesses.push(`No ${joinList(absent.map((c) => c.name.toLowerCase()))} section found.`);
    }
    if (metricCount < 3) {
        weaknesses.push("Few figures show results. Add numbers such as percentages, user counts or time saved.");
    }
    if (wordCount < 150) {
        weaknesses.push("The resume is short. Add detail on each role.");
    }
    if (weaknesses.length === 0) {
        weaknesses.push("No major weaknesses found.");
    }

    return {
        overall,
        message: scoreMessage(overall),
        breakdown: [
            { name: "Job keywords", value: keywords },
            { name: "Sections", value: sections },
            { name: "Measurable results", value: measurable },
        ],
        matched: found.map((t) => t.term),
        missing: missing.map((t) => t.term),
        strengths,
        weaknesses,
        stats: { wordCount, metricCount },
    };
}
