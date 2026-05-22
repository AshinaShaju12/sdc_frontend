function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <div className="text-xl font-semibold text-white">AI Sales Dashboard</div>
        <div className="flex items-center gap-3 text-slate-300">
          <span>Welcome back</span>
          <button className="rounded-full bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700">Profile</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
