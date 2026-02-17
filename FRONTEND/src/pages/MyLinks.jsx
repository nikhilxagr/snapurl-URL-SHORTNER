import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Copy, ExternalLink, Trash2, Edit, BarChart } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function MyLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLinks();
  }, [page, search]);

  const fetchLinks = async () => {
    try {
      const response = await api.get('/short_url/my-urls', {
        params: { page, limit: 10, search },
      });
      setLinks(response.data.data.urls);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (url) => {
    try {
      const baseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
      const shortUrl = `${baseUrl}/${url.customAlias || url.shortId}`;
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await api.delete(`/short_url/${id}`);
      toast.success('Link deleted successfully');
      fetchLinks();
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--ink)] mb-2">My Links</h1>
        <p className="text-[color:var(--muted)]">Manage all your shortened URLs</p>
      </div>

      {/* Search Bar */}
      <div className="surface p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)] w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            className="w-full pl-12 pr-4 py-3 border-2 border-[color:var(--border)] rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white/90"
          />
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {links.length === 0 ? (
          <div className="surface p-12 text-center">
            <p className="text-[color:var(--muted)] text-lg">No links found</p>
            <Link
              to="/"
              className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Create your first link
            </Link>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link._id}
              className="surface p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[color:var(--ink)] truncate">
                      {link.title || 'Untitled'}
                    </h3>
                    {!link.isActive && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-[color:var(--muted)] mb-3 truncate">
                    {link.originalUrl}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-emerald-700">
                        /{link.customAlias || link.shortId}
                      </span>
                    </div>
                    <div className="text-[color:var(--muted)]">
                      {link.clicks} clicks
                    </div>
                    <div className="text-[color:var(--muted)]">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(link)}
                    className="p-2 text-[color:var(--muted)] hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  
                  <Link
                    to={`/link/${link._id}`}
                    className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="View analytics"
                  >
                    <BarChart className="w-5 h-5" />
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-[color:var(--border)] rounded-lg hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-[color:var(--muted)]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-[color:var(--border)] rounded-lg hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
