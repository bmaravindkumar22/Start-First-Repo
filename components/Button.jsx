// The one button style used across the page. Primary is the main action; secondary is for
// file actions. Both are at least 44px tall so they are comfortable to tap.
const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 font-semibold transition-colors disabled:opacity-60";

const variants = {
    primary: "bg-accent text-on-accent hover:bg-violet-300",
    secondary: "border border-line/20 text-primary hover:border-line/40",
};

export default function Button({ variant = "primary", type = "button", className = "", children, ...props }) {
    return (
        <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
