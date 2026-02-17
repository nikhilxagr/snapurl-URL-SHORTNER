import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Copy, QrCode } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function LinkDetails() {
  const { id } = useParams();
  const [link, setLink] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkDetails();
  }, [id]);

  const fetchLinkDetails = async () => {
    try {
      const [linkRes, statsRes] = await Promise.all([
        api.get(`/short_url/${id}`),
        api.get(`/short_url/${id}/stats`),
      ]);
      setLink(linkRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch link details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const deviceData = {
    labels: Object.keys(stats?.deviceStats || {}),
    datasets: [
      {
        data: Object.values(stats?.deviceStats || {}),
        backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'],
      },
    ],
  };

  const browserData = {
    labels: Object.keys(stats?.browserStats || {}).slice(0, 5),
    datasets: [
      {
        label: 'Clicks',
        data: Object.values(stats?.browserStats || {}).slice(0, 5),
        backgroundColor: '#6366f1',
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/my-links"
        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Links
      </Link>

      {/* Link Info */}
      <div className="surface p-8 mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--ink)] mb-4">
          {link.title || 'Link Details'}
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[color:var(--muted)]">Short URL</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-mono">
                {`${import.meta.env.VITE_APP_URL || 'http://localhost:3000'}/${link.customAlias || link.shortId}`}
              </code>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(`${import.meta.env.VITE_APP_URL || 'http://localhost:3000'}/${link.customAlias || link.shortId}`);
                  toast.success('Copied!');
                }}
                className="p-2 hover:bg-emerald-50 rounded-lg"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[color:var(--muted)]">Original URL</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 px-4 py-2 bg-white border border-[color:var(--border)] rounded-lg text-sm truncate">
                {link.originalUrl}
              </div>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-emerald-50 rounded-lg"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-700">{stats?.totalClicks || 0}</div>
              <div className="text-sm text-[color:var(--muted)]">Total Clicks</div>
            </div>
            <div className="text-center p-4 bg-sky-50 rounded-lg">
              <div className="text-3xl font-bold text-sky-700">{link.isActive ? 'Active' : 'Inactive'}</div>
              <div className="text-sm text-[color:var(--muted)]">Status</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-xl font-bold text-amber-700">
                {new Date(link.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-[color:var(--muted)]">Created</div>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-lg">
              <div className="text-xl font-bold text-rose-700">
                {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never'}
              </div>
              <div className="text-sm text-[color:var(--muted)]">Expires</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="surface p-6">
          <h2 className="text-xl font-bold text-[color:var(--ink)] mb-6">Device Distribution</h2>
          <Doughnut data={deviceData} />
        </div>

        <div className="surface p-6">
          <h2 className="text-xl font-bold text-[color:var(--ink)] mb-6">Top Browsers</h2>
          <Bar data={browserData} />
        </div>
      </div>
    </div>
  );
}
