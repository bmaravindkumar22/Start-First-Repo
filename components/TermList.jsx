// A list of job terms. "missing" styles them with the correction underline,
// and the list heading says what they are, so colour is never the only signal.
export default function TermList({ title, items, emptyText, tone = "found" }) {
    return (
        <section>
            <h3 className="text-sm text-pencil">{title}</h3>
            {items.length === 0 ? (
                <p className="mt-3 text-bone">{emptyText}</p>
            ) : (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-bone">
                    {items.map((term, i) => (
                        <li
                            key={term}
                            style={{ "--i": i }}
                            className={tone === "missing" ? "missing-term text-correction" : "text-sage"}
                        >
                            {term}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
