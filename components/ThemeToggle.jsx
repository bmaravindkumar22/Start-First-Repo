// A switch that turns light mode on or off. The label names the setting, and the ON/OFF
// text shows its state, so the state is never shown by colour alone.
export default function ThemeToggle({ isLight, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={isLight}
            onClick={() => onChange(!isLight)}
            className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-line/20 px-4 py-2 font-medium"
        >
            <span>Light mode</span>
            <span
                aria-hidden="true"
                className={`min-w-10 rounded-full px-2 py-0.5 text-center text-sm font-semibold ${isLight ? "bg-accent text-on-accent" : "bg-line/10 text-muted"
                    }`}
            >
                {isLight ? "ON" : "OFF"}
            </span>
        </button>
    );
}
