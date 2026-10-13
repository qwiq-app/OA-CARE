export default function PagePlaceholder({ title, subtitle }) {
  return (
    <main className="page-container">
      <section className="grid gap-6">
        <h1 className="section-title">{title}</h1>
        <p className="max-w-3xl text-xl leading-8 text-slate-700">{subtitle}</p>
      </section>
    </main>
  );
}
