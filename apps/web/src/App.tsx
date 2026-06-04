import '@/styles/theme.css';

import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft, BarChart2, Users } from 'lucide-react';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppShell } from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { useLeadStore } from '@/stores/leadStore';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Pipeline from '@/pages/Pipeline';

/* ─── Brand CSS variables injected once at root ─────────────────────────────
   --parchment, --navy, and the cream text scale are non-shadcn brand vars.
   All inline hardcoded hsl() calls reference these instead.
   ────────────────────────────────────────────────────────────────────────── */
const BRAND_STYLE = `
  :root {
    --parchment: hsl(40, 30%, 97%);
    --navy: hsl(220, 50%, 22%);
    --navy-border: hsl(220, 50%, 28%);
    --sand-border: hsl(38, 25%, 88%);
    --cream-heading: hsl(38, 80%, 94%);
    --cream-body: hsl(38, 40%, 72%);
    --cream-faint: hsl(38, 20%, 52%);
    --col-header-bg: hsl(38, 55%, 95%);
  }
`;

// ─── Signup page ──────────────────────────────────────────────────────────────

const LABEL_CLASS =
  'uppercase tracking-[0.08em] text-[0.65rem] font-semibold text-muted-foreground mb-1.5 block';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Your name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const result = register(name.trim(), email.trim(), password);
      if (!result.ok) {
        toast.error(result.error ?? 'Registration failed.');
        setErrors({ email: result.error });
      } else {
        navigate('/pipeline');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--parchment)' }}>
      {/* Left brand panel */}
      <div
        className="hidden md:flex flex-col justify-between w-[420px] flex-shrink-0 px-10 py-12"
        style={{ background: 'var(--navy)' }}
      >
        <span
          className="text-2xl font-semibold text-primary"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          AgencyFlow
        </span>
        <div>
          <p
            className="text-4xl font-semibold leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--cream-heading)' }}
          >
            Every deal
            <br />
            starts here.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--cream-body)' }}>
            Create your account and open your pipeline in under a minute. No subscription.
            No credit card. Just your deals, organised.
          </p>
        </div>
        <p className="text-xs" style={{ color: 'var(--cream-faint)' }}>
          © {new Date().getFullYear()} AgencyFlow
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="md:hidden mb-8 text-center">
            <span
              className="text-3xl font-semibold text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              AgencyFlow
            </span>
          </div>

          <div className="mb-8">
            <h1
              className="text-2xl font-semibold text-foreground mb-1.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              A few details and your pipeline is ready.
            </p>
          </div>

          <div
            className="h-px w-full mb-8 bg-primary/20"
            aria-hidden="true"
          />

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <Label htmlFor="su-name" className={LABEL_CLASS}>
                Full Name
              </Label>
              <Input
                id="su-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="su-email" className={LABEL_CLASS}>
                Email Address
              </Label>
              <Input
                id="su-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="su-password" className={LABEL_CLASS}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="su-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold tracking-wide mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Metrics page ─────────────────────────────────────────────────────────────

function Metrics() {
  const leads = useLeadStore((s) => s.leads);

  const totalValue = leads.reduce((sum, l) => sum + (l.dealValue ?? 0), 0);
  const closedLeads = leads.filter((l) => l.stage === 'Closed');
  const closedValue = closedLeads.reduce((sum, l) => sum + (l.dealValue ?? 0), 0);
  const winRate = leads.length > 0 ? Math.round((closedLeads.length / leads.length) * 100) : 0;

  const fmt = (v: number) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v.toLocaleString()}`;
  };

  const STATS = [
    { label: 'Total Pipeline', value: fmt(totalValue) },
    { label: 'Closed Value', value: fmt(closedValue) },
    { label: 'Win Rate', value: `${winRate}%` },
    { label: 'Total Deals', value: String(leads.length) },
  ];

  return (
    <div className="px-6 md:px-10 py-8" style={{ background: 'var(--parchment)', minHeight: '100%' }}>
      <div className="mb-2">
        <h1
          className="text-2xl md:text-3xl font-semibold text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Metrics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          A clear view of your pipeline performance.
        </p>
      </div>
      <div className="h-px bg-border mt-4 mb-8" aria-hidden="true" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STATS.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl px-5 py-6 flex flex-col gap-2"
            style={{ background: 'var(--navy)' }}
          >
            <span
              className="uppercase tracking-[0.08em] text-[0.65rem] font-semibold"
              style={{ color: 'var(--cream-body)' }}
            >
              {label}
            </span>
            <span
              className="leading-none font-semibold text-[2.4rem]"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--cream-heading)',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {leads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-primary/10">
            <BarChart2 size={22} className="text-primary" />
          </div>
          <p
            className="text-lg font-semibold text-foreground mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            No data yet.
          </p>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Add deals to your pipeline and your performance metrics will appear here.
          </p>
          <Link
            to="/pipeline"
            className="mt-4 text-sm font-semibold uppercase tracking-[0.06em] text-primary hover:underline"
          >
            Open Pipeline
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Team page ────────────────────────────────────────────────────────────────

function Team() {
  const agents = useLeadStore((s) => s.agents);
  const leads = useLeadStore((s) => s.leads);

  return (
    <div className="px-6 md:px-10 py-8" style={{ background: 'var(--parchment)', minHeight: '100%' }}>
      <div className="mb-2">
        <h1
          className="text-2xl md:text-3xl font-semibold text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Team
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your agency roster. Agents appear here as they are assigned to deals.
        </p>
      </div>
      <div className="h-px bg-border mt-4 mb-8" aria-hidden="true" />

      {agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-primary/10">
            <Users size={22} className="text-primary" />
          </div>
          <p
            className="text-lg font-semibold text-foreground mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your team will appear here.
          </p>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Agents are added automatically when deals are created and assigned. Start by adding
            your first deal.
          </p>
          <Link
            to="/pipeline"
            className="mt-4 text-sm font-semibold uppercase tracking-[0.06em] text-primary hover:underline"
          >
            Open Pipeline
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const agentLeads = leads.filter((l) => l.assignedAgentId === agent.id);
            const initials = agent.name
              .split(' ')
              .map((p: string) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            return (
              <div
                key={agent.id}
                className="bg-card rounded-xl px-5 py-5 border border-border shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-primary/15 text-primary">
                    {initials}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-foreground text-sm"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {agent.name}
                    </p>
                    <p className="text-muted-foreground text-xs">{agent.email}</p>
                  </div>
                </div>
                <div className="h-px bg-border mb-3" />
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-[0.08em] text-[0.65rem] font-semibold text-muted-foreground">
                    Assigned Deals
                  </span>
                  <span
                    className="text-sm font-semibold italic text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {agentLeads.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Lead Detail stub ─────────────────────────────────────────────────────────

function LeadDetail() {
  const navigate = useNavigate();

  return (
    <div
      className="px-6 md:px-10 py-8"
      style={{ background: 'var(--parchment)', minHeight: '100%' }}
    >
      <button
        onClick={() => navigate('/pipeline')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Pipeline
      </button>
      <p className="text-muted-foreground text-sm">
        Full lead detail — activity log, team assignment, and contact info — coming soon.
      </p>
    </div>
  );
}

// ─── 404 ──────────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: 'var(--parchment)' }}
    >
      <p
        className="font-semibold mb-4 leading-none text-primary"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '6rem',
        }}
      >
        404
      </p>
      <h1
        className="text-2xl font-semibold text-foreground mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        This page has moved on.
      </h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
        The page you are looking for does not exist. Perhaps it closed before you got here.
      </p>
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      {/* Inject brand CSS variables into :root */}
      <style>{BRAND_STYLE}</style>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected app shell wrapping all inner routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/team" element={<Team />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </>
  );
}
