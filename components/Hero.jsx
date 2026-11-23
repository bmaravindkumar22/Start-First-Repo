// The opening line of the page. It says what the tool does before anything else.
export default function Hero() {
    return (
        <section className="pt-16 pb-12 lg:pt-24">
            <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-[-0.02em] sm:text-7xl">
                Read your resume the way the posting's filter reads it.
            </h1>
            <p className="mt-8 max-w-[34ch] text-lg leading-relaxed text-pencil">
                Add your resume and paste a job description. You get a match score, the terms the posting asks for
                that your resume never shows, and what to fix before you apply.
            </p>
        </section>
    );
}
