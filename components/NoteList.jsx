// Full-sentence notes, such as strengths and things to fix.
export default function NoteList({ title, items, emptyText }) {
    return (
        <section>
            <h3 className="text-sm text-pencil">{title}</h3>
            <ul className="mt-3 grid gap-3 text-bone">
                {items.length === 0 ? <li>{emptyText}</li> : items.map((item) => <li key={item}>{item}</li>)}
            </ul>
        </section>
    );
}
