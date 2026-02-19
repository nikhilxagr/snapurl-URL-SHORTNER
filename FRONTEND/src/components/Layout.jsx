import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const FULL_WIDTH_PATHS = new Set(["/"]);

export default function Layout() {
  const { pathname } = useLocation();
  const isFullWidth = FULL_WIDTH_PATHS.has(pathname);

  return (
    <div className="app-shell relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-28 -top-32 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl animate-float" />
        <div className="absolute -right-20 top-12 h-[22rem] w-[22rem] rounded-full bg-amber-200/45 blur-3xl animate-float animate-delay-200" />
        <div className="absolute bottom-[-9rem] left-1/2 h-[19rem] w-[19rem] -translate-x-1/2 rounded-full bg-cyan-200/25 blur-3xl animate-float animate-delay-400" />
      </div>

      <NavBar />

      <main className={isFullWidth ? "pt-24 pb-16" : "pt-28 pb-16"}>
        {isFullWidth ? (
          <Outlet />
        ) : (
          <div className="app-page">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}
