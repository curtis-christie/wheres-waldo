import { Link } from "react-router-dom";

const images = [
  { id: "waldo1", name: "Find Waldo 1" },
  // { id: "waldo2", name: "Find Waldo 2" },
  // { id: "waldo3", name: "Find Waldo 3" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col px-6 py-16">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Photo Tagging Game
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Find Waldo</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Choose an image, search carefully, and click directly on Waldo to finish the round as
            quickly as possible.
          </p>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <Link
              key={image.id}
              to={`/image/${image.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
                W
              </div>

              <h2 className="mb-2 text-xl font-semibold text-slate-900">{image.name}</h2>

              <p className="text-sm leading-6 text-slate-600">
                Start this round and try to spot Waldo as fast as you can.
              </p>

              <div className="mt-5 text-sm font-medium text-slate-900 transition group-hover:text-slate-700">
                Play round →
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
