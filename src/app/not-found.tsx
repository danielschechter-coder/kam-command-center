import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That account, brief, or page isn't in the mock data set.
      </p>
      <Link href="/" className="mt-6 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
        Back to dashboard
      </Link>
    </div>
  );
}
