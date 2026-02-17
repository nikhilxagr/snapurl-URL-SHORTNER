import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Shield,
  BarChart3,
  QrCode,
  Clock,
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import CreateUrlForm from "../components/CreateUrlForm";
import UrlResult from "../components/UrlResult";

export default function Home() {
  const [urlResult, setUrlResult] = useState(null);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create short URLs instantly with optimized routing.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure by Design",
      description: "Password protection and expiry windows for every link.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Actionable Analytics",
      description: "Track clicks, devices, referrers, and locations.",
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "Instant QR Codes",
      description: "Generate scan-ready QR codes for every short link.",
    },
    {
      icon: <LinkIcon className="w-6 h-6" />,
      title: "Branded Aliases",
      description: "Custom slugs that stay memorable and on-brand.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Smart Expiration",
      description: "Auto-expire temporary campaigns and promo links.",
    },
  ];

  const stats = [
    { label: "Links created", value: "100K+" },
    { label: "Active users", value: "50K+" },
    { label: "Tracked clicks", value: "5M+" },
    { label: "Uptime", value: "99.9%" },
  ];

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full pill text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Built for teams that ship fast
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight mt-6">
              Short links with
              <span className="text-emerald-700"> structure</span> and{" "}
              <span className="text-amber-600">insight</span>
            </h1>

            <p className="text-lg text-[color:var(--muted)] mt-5 max-w-xl">
              Turn long URLs into branded short links with clear analytics and
              clean workflows. Create, manage, and measure without the clutter.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/register"
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
              >
                Start free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white/80 border border-[color:var(--border)] rounded-xl font-semibold text-[color:var(--ink)] hover:bg-white transition-colors"
              >
                Sign in
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              {stats.map((stat) => (
                <div key={stat.label} className="surface-muted p-4">
                  <div className="text-2xl font-bold text-[color:var(--ink)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[color:var(--muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200/60 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-200/60 blur-3xl rounded-full" />
            <CreateUrlForm onSuccess={setUrlResult} />

            {urlResult && (
              <div className="mt-8">
                <UrlResult data={urlResult} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="surface p-8">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-[color:var(--muted)] mb-6">
              SnapURL keeps your links organized, trackable, and ready for
              campaigns. Build better URLs with a structured workflow that
              stays clean as you scale.
            </p>
            <div className="space-y-3 text-sm text-[color:var(--muted)]">
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                Segment links by campaign, product, or team.
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                Track performance with clean dashboards.
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                Share QR codes instantly for offline use.
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="surface p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[color:var(--ink)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[color:var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center surface p-10">
          <h2 className="text-4xl font-bold mb-4">Launch your next campaign</h2>
          <p className="text-lg text-[color:var(--muted)] mb-8">
            Create an account, organize your links, and start tracking results
            in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-7 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Get started free
            </Link>
            <Link
              to="/login"
              className="px-7 py-3 bg-white border border-[color:var(--border)] rounded-xl font-semibold text-[color:var(--ink)] hover:bg-white/90 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
