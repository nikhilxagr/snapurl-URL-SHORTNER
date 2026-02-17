import { useState } from 'react';
import { Copy, Check, QrCode, ExternalLink, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UrlResult({ data }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.shortUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = data.qrCode;
    link.download = `qr-${data.shortId}.png`;
    link.click();
    toast.success('QR Code downloaded!');
  };

  return (
    <div className="surface p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[color:var(--ink)]">Success!</h3>
          <p className="text-sm text-[color:var(--muted)]">Your short URL is ready</p>
        </div>
      </div>

      {/* Short URL Display */}
      <div className="surface-inset p-4 mb-4">
        <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
          Short URL
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={data.shortUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-white border border-[color:var(--border)] rounded-lg font-mono text-lg text-emerald-700"
          />
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Original URL */}
      <div className="surface-inset p-4 mb-4">
        <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
          Original URL
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-white border border-[color:var(--border)] rounded-lg text-sm text-[color:var(--ink)] truncate">
            {data.originalUrl}
          </div>
          <a
            href={data.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 px-6 py-3 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <QrCode className="w-5 h-5" />
          {showQR ? 'Hide' : 'Show'} QR Code
        </button>
        
        {data.qrCode && (
          <button
            onClick={handleDownloadQR}
            className="px-6 py-3 bg-white border-2 border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2 font-medium"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
        )}
      </div>

      {/* QR Code Display */}
      {showQR && data.qrCode && (
        <div className="mt-4 p-6 surface-inset text-center">
          <img
            src={data.qrCode}
            alt="QR Code"
            className="mx-auto w-64 h-64 border-4 border-[color:var(--border)] rounded-xl"
          />
          <p className="mt-4 text-sm text-[color:var(--muted)]">
            Scan this QR code to access your short URL
          </p>
        </div>
      )}
    </div>
  );
}
