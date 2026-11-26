// Step 2. The posting box. The label stays visible above the field, so the field is
// never identified by its placeholder alone.
export default function JobCard({ value, onChange }) {
    return (
        <section className="flex min-w-0 flex-col rounded-xl border border-line/10 bg-surface p-6">
            <label htmlFor="job-description" className="text-lg font-semibold">
                2. Job description
            </label>
            <textarea
                id="job-description"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Paste the full job description here, including responsibilities and requirements."
                className="mt-5 min-h-72 w-full flex-1 resize-y rounded-xl orange-field bg-canvas p-4 leading-relaxed text-primary placeholder:text-muted"
            />
        </section>
    );
}
