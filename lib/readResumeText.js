import * as pdfjs from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import mammoth from "mammoth";

// pdf.js does its parsing in a worker. Vite gives us the worker's URL at build time.
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Returns the plain text of a PDF or .docx file. Everything happens in the browser.
export async function readResumeText(file) {
    const data = await file.arrayBuffer();

    if (file.name.toLowerCase().endsWith(".pdf")) {
        const pdf = await pdfjs.getDocument({ data }).promise;
        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            pages.push(content.items.map((item) => item.str).join(" "));
        }
        return pages.join("\n");
    }

    const { value } = await mammoth.extractRawText({ arrayBuffer: data });
    return value;
}
