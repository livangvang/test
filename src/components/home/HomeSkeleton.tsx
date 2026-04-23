export function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      <section className="relative mt-16 overflow-hidden bg-gradient-to-br from-bg via-bg2 to-bg">
        <div className="mx-auto grid min-h-[520px] max-w-[1200px] grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-15 md:px-10 md:py-25">
            <div className="mb-5 h-3 w-40 rounded bg-bg3" />
            <div className="mb-5 space-y-3">
              <div className="h-12 w-60 rounded bg-bg3" />
              <div className="h-12 w-48 rounded bg-bg3" />
              <div className="h-12 w-40 rounded bg-bg3" />
            </div>
            <div className="mb-10 h-4 w-80 rounded bg-bg3" />
            <div className="flex gap-10">
              <div className="h-14 w-20 rounded bg-bg3" />
              <div className="h-14 w-16 rounded bg-bg3" />
              <div className="h-14 w-20 rounded bg-bg3" />
            </div>
          </div>
          <div className="h-[280px] bg-bg3 md:h-auto" />
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 pt-12 pb-6 md:px-10">
        <div className="h-3 w-32 rounded bg-bg3" />
      </div>

      <section className="mx-auto max-w-[1200px] px-5 pb-15 md:px-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card">
              <div className="h-[220px] bg-bg3" />
              <div className="space-y-3 px-7 py-6">
                <div className="h-5 w-24 rounded bg-bg3" />
                <div className="h-3 w-32 rounded bg-bg3" />
                <div className="flex gap-5">
                  <div className="h-10 w-12 rounded bg-bg3" />
                  <div className="h-10 w-10 rounded bg-bg3" />
                </div>
                <div className="h-3 w-full rounded bg-bg3" />
                <div className="h-3 w-4/5 rounded bg-bg3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
