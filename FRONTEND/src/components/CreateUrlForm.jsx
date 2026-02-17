import { useState } from 'react';
import { Link2, Sparkles, Settings, ChevronDown, Lock, Calendar, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function CreateUrlForm({ onSuccess }) {
  const [url, setUrl] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [advancedOptions, setAdvancedOptions] = useState({
    customAlias: '',
    title: '',
    description: '',
    password: '',
    expiresIn: '',
    maxClicks: '',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        originalUrl: url,
        ...(advancedOptions.customAlias && { customAlias: advancedOptions.customAlias }),
        ...(advancedOptions.title && { title: advancedOptions.title }),
        ...(advancedOptions.description && { description: advancedOptions.description }),
        ...(advancedOptions.password && { password: advancedOptions.password }),
        ...(advancedOptions.expiresIn && { expiresIn: parseInt(advancedOptions.expiresIn) }),
        ...(advancedOptions.maxClicks && { maxClicks: parseInt(advancedOptions.maxClicks) }),
        ...(advancedOptions.tags && { tags: advancedOptions.tags.split(',').map(t => t.trim()) })
      };

      const response = await api.post('/short_url/create', payload);
      
      toast.success('Short URL created successfully!');
      onSuccess(response.data.data);
      
      // Reset form
      setUrl('');
      setAdvancedOptions({
        customAlias: '',
        title: '',
        description: '',
        password: '',
        expiresIn: '',
        maxClicks: '',
        tags: ''
      });
      setShowAdvanced(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create short URL';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main URL Input */}
        <div>
          <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
            Enter your long URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)] w-5 h-5" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very-long-url"
              className="w-full pl-12 pr-4 py-4 border-2 border-[color:var(--border)] rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-lg bg-white/90"
              required
            />
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
        >
          <Settings className="w-5 h-5" />
          Advanced Options
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="grid md:grid-cols-2 gap-4 p-6 bg-[color:var(--surface-alt)] rounded-xl border border-[color:var(--border)]">
            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Custom Alias
              </label>
              <input
                type="text"
                value={advancedOptions.customAlias}
                onChange={(e) => setAdvancedOptions({...advancedOptions, customAlias: e.target.value})}
                placeholder="my-custom-link"
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-white/90"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
                Title
              </label>
              <input
                type="text"
                value={advancedOptions.title}
                onChange={(e) => setAdvancedOptions({...advancedOptions, title: e.target.value})}
                placeholder="Link title"
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-white/90"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
                Description
              </label>
              <input
                type="text"
                value={advancedOptions.description}
                onChange={(e) => setAdvancedOptions({...advancedOptions, description: e.target.value})}
                placeholder="Optional description"
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-white/90"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Password Protection
              </label>
              <input
                type="password"
                value={advancedOptions.password}
                onChange={(e) => setAdvancedOptions({...advancedOptions, password: e.target.value})}
                placeholder="Optional password"
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-white/90"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Expires in (days)
              </label>
              <input
                type="number"
                value={advancedOptions.expiresIn}
                onChange={(e) => setAdvancedOptions({...advancedOptions, expiresIn: e.target.value})}
                placeholder="7"
                min="1"
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-white/90"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
                Max Clicks
              </label>
              <input
                type="number"
                value={advancedOptions.maxClicks}
                onChange={(e) => setAdvancedOptions({...advancedOptions, maxClicks: e.target.value})}
                placeholder="1000"
                min="1"
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-white/90"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={advancedOptions.tags}
                onChange={(e) => setAdvancedOptions({...advancedOptions, tags: e.target.value})}
                placeholder="marketing, campaign"
                className="w-full px-4 py-2 border border-[color:var(--border)] rounded-lg focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none bg-white/90"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Shorten URL
            </>
          )}
        </button>
      </form>
    </div>
  );
}
