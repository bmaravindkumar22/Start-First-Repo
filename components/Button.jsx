// The primary action. Defaults to type="button" so it never submits a form by accident.
export default function Button({ children, type = "button", className = "", ...props }) {
    return (
        <button
            type={type}
            className={`bg-bone px-6 py-3 font-bold text-ink disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
