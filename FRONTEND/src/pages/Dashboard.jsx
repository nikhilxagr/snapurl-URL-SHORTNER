import { useEffect, useState } from 'react';
import { Link, TrendingUp, MousePointerClick, LinkIcon, Calendar } from 'lucide-react';
import api from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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

  const chartData = {
    labels: stats?.clicksOverTime?.map(d => new Date(d._id).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Clicks',
        data: stats?.clicksOverTime?.map(d => d.clicks) || [],
        fill: true,
        backgroundColor: 'rgba(31, 157, 143, 0.12)',
        borderColor: 'rgb(31, 157, 143)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const statCards = [
    {
      title: 'Total Links',
      value: stats?.totalUrls || 0,
      icon: <LinkIcon className="w-6 h-6" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Clicks',
      value: stats?.totalClicks || 0,
      icon: <MousePointerClick className="w-6 h-6" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      title: 'Active Links',
      value: stats?.activeUrls || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-700'
    },
    {
      title: 'Avg. Clicks/Link',
      value: stats?.totalUrls ? Math.round(stats.totalClicks / stats.totalUrls) : 0,
      icon: <Calendar className="w-6 h-6" />,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--ink)] mb-2">Dashboard</h1>
        <p className="text-[color:var(--muted)]">Overview of your URL shortening activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="surface p-6 hover:shadow-xl transition-shadow">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
              <div className={stat.textColor}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-[color:var(--ink)] mb-1">{stat.value}</div>
            <div className="text-sm text-[color:var(--muted)]">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="surface p-6 mb-8">
        <h2 className="text-xl font-bold text-[color:var(--ink)] mb-6">Clicks Over Time (Last 30 Days)</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Top & Recent Links */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Performing */}
        <div className="surface p-6">
          <h2 className="text-xl font-bold text-[color:var(--ink)] mb-6">Top Performing Links</h2>
          <div className="space-y-4">
            {stats?.topUrls?.map((url, index) => (
              <Link
                key={url._id}
                to={`/link/${url._id}`}
                className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-[color:var(--border)] hover:bg-white transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[color:var(--ink)] truncate group-hover:text-emerald-700 transition-colors">
                    {url.title || url.originalUrl}
                  </div>
                  <div className="text-sm text-[color:var(--muted)] truncate">
                    /{url.customAlias || url.shortId}
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-2xl font-bold text-emerald-700">{url.clicks}</div>
                  <div className="text-xs text-[color:var(--muted)]">clicks</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Links */}
        <div className="surface p-6">
          <h2 className="text-xl font-bold text-[color:var(--ink)] mb-6">Recent Links</h2>
          <div className="space-y-4">
            {stats?.recentUrls?.map((url) => (
              <Link
                key={url._id}
                to={`/link/${url._id}`}
                className="flex items-center justify-between p-4 bg-white/80 rounded-xl border border-[color:var(--border)] hover:bg-white transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[color:var(--ink)] truncate group-hover:text-emerald-700 transition-colors">
                    {url.title || url.originalUrl}
                  </div>
                  <div className="text-sm text-[color:var(--muted)]">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="ml-4 text-sm text-[color:var(--muted)]">
                  {url.clicks} clicks
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
