import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  LinkIcon,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import api from "../services/api";

const cardTones = [
  "from-[#0f8f84] to-[#16a193]",
  "from-[#0e6e86] to-[#3a8ba4]",
  "from-[#d97706] to-[#e89d2b]",
  "from-[#19587a] to-[#1f6e92]",
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/analytics/dashboard");
      setStats(response.data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load dashboard metrics.",
      );
    } finally {
      setLoading(false);
    }
  };

  const statCards = useMemo(() => {
    const totalUrls = stats?.totalUrls || 0;
    const totalClicks = stats?.totalClicks || 0;
    const activeUrls = stats?.activeUrls || 0;
    const avgClicks = totalUrls ? Math.round(totalClicks / totalUrls) : 0;

    return [
      {
        title: "Total Links",
        value: totalUrls,
        icon: <LinkIcon className="h-5 w-5" />,
      },
      {
        title: "Total Clicks",
        value: totalClicks,
        icon: <MousePointerClick className="h-5 w-5" />,
      },
      {
        title: "Active Links",
        value: activeUrls,
        icon: <TrendingUp className="h-5 w-5" />,
      },
      {
        title: "Average Clicks/Link",
        value: avgClicks,
        icon: <Activity className="h-5 w-5" />,
      },
    ];
  }, [stats]);

  const trafficSeries = useMemo(() => {
    return (stats?.clicksOverTime || []).slice(-14);
  }, [stats]);

  const maxTraffic = useMemo(() => {
    if (!trafficSeries.length) return 1;
    return Math.max(...trafficSeries.map((item) => item.clicks), 1);
  }, [trafficSeries]);

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[#d0e9e6] border-t-[#0f8f84]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="surface-card p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button onClick={fetchStats} className="btn-primary mt-5 text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <header className="surface-card p-6 sm:p-8">
        <span className="chip">Performance Overview</span>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Dashboard</h1>
        <p className="mt-2 text-muted">
          Monitor traffic, active links, and top performers from one place.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => (
          <article key={card.title} className="soft-card p-4">
            <span
              className={`mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${cardTones[index]} text-white`}
            >
              {card.icon}
            </span>
            <p className="text-3xl font-extrabold tracking-tight">{card.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
              {card.title}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-bold">Traffic (Last 14 days)</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-500">
              Click events
            </span>
          </div>

          {trafficSeries.length ? (
            <div className="mt-6 flex h-56 items-end gap-2">
              {trafficSeries.map((item) => {
                const heightPercent = Math.max(
                  8,
                  Math.round((item.clicks / maxTraffic) * 100),
                );

                return (
                  <div key={item._id} className="flex min-w-0 flex-1 flex-col items-center">
                    <div className="flex h-40 w-full items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-[#0f8f84] to-[#53c7bb]"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] font-semibold text-slate-500">
                      {item._id.slice(5)}
                    </p>
                    <p className="text-[11px] text-slate-600">{item.clicks}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-dashed border-[#d9ceb9] bg-[#fff8ea] p-4 text-sm text-muted">
              No click activity in the last 14 days.
            </p>
          )}
        </article>

        <article className="surface-card p-5 sm:p-6">
          <h2 className="text-2xl font-bold">Top Links</h2>
          <p className="mt-1 text-sm text-muted">Best-performing URLs by click volume.</p>

          <div className="mt-4 space-y-3">
            {(stats?.topUrls || []).length ? (
              stats.topUrls.map((url) => (
                <RouterLink
                  key={url._id}
                  to={`/link/${url._id}`}
                  className="group block rounded-xl border border-[#d9cfbc] bg-white/80 p-3 transition hover:bg-white"
                >
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {url.title || url.originalUrl}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate font-mono text-[#0e6e86]">
                      /{url.customAlias || url.shortId}
                    </span>
                    <span className="font-semibold text-slate-700">{url.clicks} clicks</span>
                  </div>
                </RouterLink>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-[#d9ceb9] bg-[#fff8ea] p-4 text-sm text-muted">
                No links yet. Create one from the home page.
              </p>
            )}
          </div>

          <RouterLink
            to="/my-links"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0e6e86] hover:text-[#0b5d72]"
          >
            Open all links
            <ArrowRight className="h-4 w-4" />
          </RouterLink>
        </article>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="text-2xl font-bold">Recent Links</h2>
        <p className="mt-1 text-sm text-muted">Newest links you created.</p>

        <div className="mt-4 space-y-3">
          {(stats?.recentUrls || []).length ? (
            stats.recentUrls.map((url) => (
              <RouterLink
                key={url._id}
                to={`/link/${url._id}`}
                className="group flex flex-col gap-2 rounded-xl border border-[#d9cfbc] bg-white/85 p-4 transition hover:bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{url.originalUrl}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Created {new Date(url.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm font-semibold text-[#0f8f84]">{url.clicks} clicks</div>
              </RouterLink>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-[#d9ceb9] bg-[#fff8ea] p-4 text-sm text-muted">
              No recent links available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
