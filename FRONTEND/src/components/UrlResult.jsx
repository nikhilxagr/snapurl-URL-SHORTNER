import { useState } from "react";
import { Check, Copy, Download, ExternalLink, QrCode } from "lucide-react";
import toast from "react-hot-toast";

export default function UrlResult({ data }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!data) return null;

  const shortUrl = data.shortUrl || "";
  const originalUrl = data.originalUrl || "";

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shortUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = shortUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDownloadQR = () => {
    if (!data.qrCode) return;

    const link = document.createElement("a");
    link.href = data.qrCode;
    link.download = `qr-${data.shortId || "link"}.png`;
    link.click();
    toast.success("QR code downloaded");
  };

  return (
    <div className="surface-card animate-rise overflow-hidden border-[#cbe3db] bg-[linear-gradient(145deg,rgba(232,252,246,0.92),rgba(255,248,235,0.96))] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#0f8f84] to-[#167f6f] text-white shadow-md">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-xl font-bold">Your link is ready</h3>
          <p className="text-sm text-muted">Share it, track it, or export a QR code.</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Short URL
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={shortUrl}
              readOnly
              onClick={handleCopy}
              className="field flex-1 cursor-pointer bg-white font-mono text-sm text-[#0e6e86]"
            />
            <button
              onClick={handleCopy}
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </label>

        <div className="rounded-xl border border-[#d7d0c2] bg-white/80 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.11em] text-slate-500">
            Original URL
          </p>
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-sm text-slate-700">{originalUrl}</p>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#d7d0c2] bg-white text-slate-600 hover:text-[#0f8f84]"
              title="Open original URL"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowQR((prev) => !prev)}
            className="btn-ghost inline-flex items-center gap-2 text-sm"
          >
            <QrCode className="h-4 w-4" />
            {showQR ? "Hide QR Code" : "Show QR Code"}
          </button>

          {data.qrCode && (
            <button
              onClick={handleDownloadQR}
              className="btn-ghost inline-flex items-center gap-2 text-sm"
            >
              <Download className="h-4 w-4" />
              Download QR
            </button>
          )}
        </div>
      </div>

      {showQR && data.qrCode && (
        <div className="mt-4 rounded-2xl border border-[#d8cfbf] bg-white/85 p-4 text-center">
          <img
            src={data.qrCode}
            alt="QR Code"
            className="mx-auto h-52 w-52 rounded-xl border border-[#e4d9c5] bg-white p-2 shadow-sm"
          />
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.11em] text-slate-500">
            Scan to open short URL
          </p>
        </div>
      )}
    </div>
  );
}
