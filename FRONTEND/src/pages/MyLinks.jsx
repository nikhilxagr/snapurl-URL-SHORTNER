import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Copy, Trash2, BarChart } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function MyLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLinks();
  }, [search]);

  const fetchLinks = async () => {
    try {
      const response = await api.get("/short_url/my-urls", {
        params: { page: 1, limit: 50, search },
      });
      setLinks(response.data.data.urls);
    } catch (error) {
      toast.error("Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (url) => {
    try {
      const baseUrl = import.meta.env.VITE_APP_URL || "http://localhost:3000";
      const shortUrl = `${baseUrl}/${url.customAlias || url.shortId}`;
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this link?")) return;

    try {
      await api.delete(`/short_url/${id}`);
      toast.success("Link deleted");
      fetchLinks();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Links</h1>
        <p className="text-gray-600">Manage your shortened URLs</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
          />
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-600">No links found</p>
          </div>
        ) : (
          links.map((link) => (
            <div
              key={link._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate mb-1">
                    {link.originalUrl}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-mono text-indigo-600">
                      /{link.customAlias || link.shortId}
                    </span>
                    <span>{link.clicks} clicks</span>
                    <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(link)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Copy"
                  >
                    <Copy className="w-5 h-5" />
                  </button>

                  <Link
                    to={`/link/${link._id}`}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    title="Analytics"
                  >
                    <BarChart className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={() => handleDelete(link._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
    </div>
  );
}
