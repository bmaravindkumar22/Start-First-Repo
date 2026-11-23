// The posting box. It is the same height as the drop zone so the two columns line up.
export default function JobDescriptionField({ id, value, onChange }) {
    return (
        <>
            <label htmlFor={id} className="font-display text-2xl font-medium">
                Job description
            </label>
            <textarea
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Paste the full posting, including the requirements."
                className="mt-5 h-80 w-full resize-none border border-white/25 bg-transparent p-4 text-bone placeholder:text-pencil"
            />
        </>
    );
}
