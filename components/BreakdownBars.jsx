// One thin bar per measure. The bar's length is the value, so the number is also shown as text.
export default function BreakdownBars({ items }) {
    return (
        <ul className="grid gap-6">
            {items.map((item) => (
                <li key={item.name}>
                    <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="tabular-nums">{item.value}%</span>
                    </div>
                    <div className="mt-2 h-0.5 bg-white/10" aria-hidden="true">
                        <div className="h-0.5 bg-bone" style={{ width: `${item.value}%` }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}
