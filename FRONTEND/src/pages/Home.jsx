import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  BarChart3,
  Globe2,
  Lock,
  QrCode,
  Sparkles,
  Zap,
} from "lucide-react";
import CreateUrlForm from "../components/CreateUrlForm";
import UrlResult from "../components/UrlResult";

const stats = [
  { label: "Links Created", value: "100K+" },
  { label: "Clicks Tracked", value: "5M+" },
  { label: "Active Users", value: "50K+" },
  { label: "Uptime", value: "99.9%" },
];

const features = [
  {
    title: "High-speed redirects",
    description:
      "Your audience reaches the destination fast with optimized short-link routing.",
    icon: <Zap className="h-5 w-5" />,
    tone: "from-[#0f8f84] to-[#13a89a]",
  },
  {
    title: "Detailed analytics",
    description:
      "Track clicks, referrers, browsers, and devices to understand campaign performance.",
    icon: <BarChart3 className="h-5 w-5" />,
    tone: "from-[#0e6e86] to-[#3f8fab]",
  },
  {
    title: "Built-in QR generation",
    description: "Each short URL can ship with a QR code for print and offline touchpoints.",
    icon: <QrCode className="h-5 w-5" />,
    tone: "from-[#d97706] to-[#f2a32b]",
  },
  {
    title: "Optional protection",
    description:
      "Add passwords and expiration windows whenever a link needs extra control.",
    icon: <Lock className="h-5 w-5" />,
    tone: "from-[#0e6f5f] to-[#2f9b88]",
  },
];

export default function Home() {
  const [urlResult, setUrlResult] = useState(null);

  return (
    <div className="app-page space-y-20">
      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="pt-4">
          <span className="chip">
            <Globe2 className="h-3.5 w-3.5" />
            Professional short-link platform
          </span>

          <h1 className="mt-5 max-w-[14ch] text-5xl font-bold leading-[1.02] sm:text-6xl">
            Short links, stronger growth.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted">
            snapURL turns bulky links into clean, branded URLs with live performance data
            and secure sharing controls.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <RouterLink to="/register" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Start free
            </RouterLink>
            <RouterLink to="/login" className="btn-ghost inline-flex items-center gap-2">
              Sign in
            </RouterLink>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="kpi-card">
                <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <CreateUrlForm onSuccess={setUrlResult} />
          {urlResult ? <UrlResult data={urlResult} /> : null}
        </div>
      </section>

      <section className="surface-card p-6 sm:p-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Everything needed to manage links</h2>
            <p className="mt-2 max-w-2xl text-muted">
              From campaign tracking to QR exports, the toolset is designed for teams
              that treat links as performance assets.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="soft-card p-5">
              <span
                className={`mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${feature.tone} text-white shadow-sm`}
              >
                {feature.icon}
              </span>
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
