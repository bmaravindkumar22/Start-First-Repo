// The overall score as a large numeral, with the plain-language verdict beside it.
export default function ScoreBlock({ overall, message, stats }) {
    return (
        <div>
            <p className="font-display text-[8rem] font-medium leading-none tabular-nums">{overall}</p>
            <p className="mt-5 max-w-[30ch] text-lg leading-relaxed text-bone">{message}</p>
            <p className="mt-4 text-sm text-pencil">
                {stats.wordCount} words. {stats.metricCount} measurable figures.
            </p>
        </div>
    );
}
