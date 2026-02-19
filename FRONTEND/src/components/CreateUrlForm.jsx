import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Link2,
  Lock,
  Settings2,
  Sparkles,
  Type,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function CreateUrlForm({ onSuccess }) {
  const [url, setUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    customAlias: "",
    password: "",
    expiresIn: "",
  });

  const updateOption = (key, value) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedUrl = url.trim();
    if (!normalizedUrl) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      toast.error("Please enter a valid URL including http:// or https://");
      return;
    }

    setLoading(true);

    try {
      const expiresIn = Number.parseInt(options.expiresIn, 10);
      const payload = {
        originalUrl: normalizedUrl,
        ...(options.customAlias.trim() && {
          customAlias: options.customAlias.trim(),
        }),
        ...(options.password.trim() && { password: options.password.trim() }),
        ...(Number.isFinite(expiresIn) && expiresIn > 0 && { expiresIn }),
      };

      const response = await api.post("/short_url/create", payload);
      toast.success("Short URL created");
      onSuccess?.(response.data.data);

      setUrl("");
      setOptions({ customAlias: "", password: "", expiresIn: "" });
      setShowAdvanced(false);
    } catch (error) {
      if (!error.response) {
        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        toast.error(
          `Cannot reach backend at ${apiUrl}. Start backend and verify it is running.`,
        );
      } else if (error.response.status === 503) {
        toast.error(
          error.response.data?.message ||
            "Database is unavailable. Check backend MongoDB connection.",
        );
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create short URL",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card p-5 sm:p-7">
      <div className="mb-5">
        <h2 className="text-3xl font-bold">Create a short link</h2>
        <p className="mt-2 text-sm text-muted">
          Paste your destination URL and publish a clean, trackable link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Destination URL
          </span>
          <div className="relative">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/products/winter-launch"
              className="field pl-9"
              required
            />
          </div>
        </label>

        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0e6e86]"
        >
          <Settings2 className="h-4 w-4" />
          Advanced options
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>

        {showAdvanced && (
          <div className="animate-rise grid gap-3 rounded-2xl border border-[#ded3bf] bg-[#fffaf0]/90 p-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                <Type className="h-3.5 w-3.5 text-[#0f8f84]" />
                Custom Alias
              </span>
              <input
                type="text"
                value={options.customAlias}
                onChange={(event) => updateOption("customAlias", event.target.value)}
                placeholder="spring-sale"
                className="field"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                <Lock className="h-3.5 w-3.5 text-[#0f8f84]" />
                Password
              </span>
              <input
                type="password"
                value={options.password}
                onChange={(event) => updateOption("password", event.target.value)}
                placeholder="Optional"
                className="field"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-[#0f8f84]" />
                Expires in days
              </span>
              <input
                type="number"
                min="1"
                value={options.expiresIn}
                onChange={(event) => updateOption("expiresIn", event.target.value)}
                placeholder="7"
                className="field"
              />
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex w-full items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating link
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Shorten URL
            </>
          )}
        </button>

        <p className="text-center text-xs font-medium uppercase tracking-[0.11em] text-slate-500">
          Free to use | Instant results | No card required
        </p>
      </form>
    </div>
  );
}
