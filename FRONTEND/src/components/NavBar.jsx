import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Link2,
  LinkIcon,
  LogOut,
  Menu,
  UserCircle2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function isActivePath(currentPath, targetPath) {
  if (targetPath === "/my-links") {
    return currentPath === "/my-links" || currentPath.startsWith("/link/");
  }

  return currentPath === targetPath;
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const navLinks = useMemo(() => {
    if (!user) return [];

    return [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        path: "/my-links",
        label: "My Links",
        icon: <LinkIcon className="h-4 w-4" />,
      },
    ];
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#dcd3c4] bg-[rgba(252,248,239,0.86)] backdrop-blur-xl">
      <div className="app-page">
        <div className="flex h-[74px] items-center justify-between gap-3">
          <Link to="/" className="group inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#0f8f84] to-[#0d5f84] text-white shadow-lg transition-transform group-hover:scale-105">
              <Link2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-tight text-slate-900">
                snapURL
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Link Intelligence
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      isActivePath(location.pathname, link.path)
                        ? "bg-gradient-to-r from-[#0f8f84] to-[#0e6e86] text-white shadow-md"
                        : "text-slate-700 hover:bg-white"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}

                <div className="ml-2 flex items-center gap-2 border-l border-[#d7cdbb] pl-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                    <UserCircle2 className="h-4 w-4 text-[#0f8f84]" />
                    <span className="max-w-28 truncate">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost inline-flex items-center gap-2 px-3 py-2 text-sm"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Create Account
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4c9b5] bg-white text-slate-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="mb-3 rounded-2xl border border-[#d8cfbf] bg-[rgba(255,255,255,0.9)] p-3 md:hidden">
            {user ? (
              <>
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <UserCircle2 className="h-5 w-5 text-[#0f8f84]" />
                  <span className="truncate">{user.name}</span>
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                      isActivePath(location.pathname, link.path)
                        ? "bg-gradient-to-r from-[#0f8f84] to-[#0e6e86] text-white"
                        : "bg-white text-slate-700"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9d2c4] bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid gap-2">
                <Link to="/login" className="btn-ghost text-center text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-center text-sm">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
