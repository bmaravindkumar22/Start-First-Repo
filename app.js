import { analyze, MIN_JD_CHARS } from "./analyze.js";
import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs";

pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

const MAX_BYTES = 5 * 1024 * 1024;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (id) => document.getElementById(id);
const dropzone = $("dropzone");
const fileInput = $("file-input");
const browse = $("browse");
const fileLabel = $("file-label");
const form = $("analyze-form");
const jdInput = $("jd");
const submit = $("submit");
const statusBox = $("status");
const errorBox = $("error");
const results = $("results");

let file = null;

function showError(message) {
    errorBox.textContent = message;
}

function setFile(candidate) {
    showError("");
    if (!candidate) return;

    const name = candidate.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
        showError("That file type is not supported. Upload a PDF or a .docx file.");
        return;
    }
    if (candidate.size > MAX_BYTES) {
        showError("That file is over 5 MB. Upload a smaller copy.");
        return;
    }

    file = candidate;
    fileLabel.textContent = candidate.name;
}

// Drag events fire on child elements too, so the highlight is set and cleared
// on the drop zone itself and the browser's default file-open is cancelled.
for (const type of ["dragenter", "dragover"]) {
    dropzone.addEventListener(type, (event) => {
        event.preventDefault();
        dropzone.dataset.dragging = "true";
    });
}
for (const type of ["dragleave", "drop"]) {
    dropzone.addEventListener(type, (event) => {
        event.preventDefault();
        delete dropzone.dataset.dragging;
    });
}
dropzone.addEventListener("drop", (event) => setFile(event.dataTransfer.files[0]));

browse.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => setFile(fileInput.files[0]));

// Pulls plain text out of a PDF page by page, or out of a .docx file.
async function readFile(selected) {
    const name = selected.name.toLowerCase();

    if (name.endsWith(".pdf")) {
        const pdf = await pdfjs.getDocument({ data: await selected.arrayBuffer() }).promise;
        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            pages.push(content.items.map((item) => item.str).join(" "));
        }
        return pages.join("\n");
    }

    const { value } = await window.mammoth.extractRawText({ arrayBuffer: await selected.arrayBuffer() });
    return value;
}

const el = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
};

function listBlock(title, items, emptyText, itemClass = "") {
    const block = el("section");
    block.append(el("h3", "text-sm text-pencil", title));

    if (items.length === 0) {
        block.append(el("p", "mt-3 text-bone", emptyText));
        return block;
    }

    const list = el("ul", "mt-3 grid gap-3 text-bone");
    for (const item of items) list.append(el("li", itemClass, item));
    block.append(list);
    return block;
}

function renderReport(report) {
    const top = el("div", "mt-12 grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-20");

    const score = el("div");
    score.append(
        el("p", "font-display text-[8rem] font-medium leading-none tabular-nums", String(report.overall)),
        el("p", "mt-5 max-w-[30ch] text-lg leading-relaxed text-bone", report.message),
        el("p", "mt-4 text-sm text-pencil", `${report.stats.wordCount} words. ${report.stats.metricCount} measurable figures.`),
    );

    const bars = el("ul", "grid gap-6");
    for (const item of report.breakdown) {
        const row = el("div", "flex justify-between text-sm");
        row.append(el("span", "", item.name), el("span", "tabular-nums", `${item.value}%`));

        const track = el("div", "mt-2 h-0.5 bg-white/10");
        const fill = el("div", "h-0.5 bg-bone");
        fill.style.width = `${item.value}%`;
        track.append(fill);

        const li = el("li");
        li.append(row, track);
        bars.append(li);
    }
    top.append(score, bars);

    const lists = el("div", "mt-16 grid gap-12 sm:grid-cols-2");
    lists.append(
        listBlock("Found on your resume", report.matched, "None of the posting's terms were found."),
        listBlock(
            "Missing from your resume",
            report.missing,
            "Nothing important is missing.",
            "missing-term text-correction",
        ),
        listBlock("Strengths", report.strengths, "No clear strengths found."),
        listBlock("Weaknesses", report.weaknesses, "No major weaknesses found."),
    );

    results.replaceChildren(el("h2", "font-display text-4xl font-medium", "Your scorecard"), top, lists);
    results.id = "results";
    results.hidden = false;
    results.focus({ preventScroll: true });
    results.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError("");

    if (!file) {
        showError("Add your resume first. Drop a PDF or .docx above.");
        return;
    }
    if (jdInput.value.trim().length < MIN_JD_CHARS) {
        showError("The job description is too short. Paste the full posting.");
        return;
    }

    submit.disabled = true;
    statusBox.textContent = "Reading your resume…";
    try {
        const text = await readFile(file);
        statusBox.textContent = "Comparing it with the posting…";
        renderReport(analyze(text, jdInput.value));
        statusBox.textContent = "Your scorecard is below.";
    } catch (error) {
        statusBox.textContent = "";
        showError(error.message || "Something went wrong reading that file. Try a different copy.");
    } finally {
        submit.disabled = false;
    }
});
