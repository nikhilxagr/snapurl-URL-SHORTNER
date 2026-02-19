import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function LinkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      toast.error("Failed to fetch link details");
      navigate("/my-links");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      const shortUrl = `${import.meta.env.VITE_APP_URL || "http://localhost:3000"}/${link.customAlias || link.shortId}`;
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied!");
    } catch (error) {
      toast.error("Failed to copy");
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
      <Link
        to="/my-links"
        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Links
      </Link>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Link Details</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Short URL
            </label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-mono">
                {`${import.meta.env.VITE_APP_URL || "http://localhost:3000"}/${link.customAlias || link.shortId}`}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Original URL
            </label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-sm truncate">
                {link.originalUrl}
              </div>
              <a
                href={link.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {stats?.totalClicks || 0}
              </div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {link.isActive ? "Active" : "Inactive"}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-bold text-purple-600">
                {new Date(link.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Created</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-sm font-bold text-orange-600">
                {link.expiresAt
                  ? new Date(link.expiresAt).toLocaleDateString()
                  : "Never"}
              </div>
              <div className="text-sm text-gray-600">Expires</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
