import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-lg font-semibold tracking-tight text-slate-900 transition hover:text-slate-700"
        >
          Waldo Finder
        </Link>

        <Link
          to="/"
          className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Home
        </Link>
      </div>
    </nav>
  );
}
