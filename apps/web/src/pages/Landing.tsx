import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BarChart2, Users, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    Icon: LayoutGrid,
    title: 'Visual Pipeline',
    body: 'Move deals through four stages — New, Contacted, Proposal, Closed — with a drag-and-drop board built for speed.',
  },
  {
    Icon: BarChart2,
    title: 'Pipeline Intelligence',
    body: 'Understand your deal velocity, win rate, and agent performance at a glance. No spreadsheets required.',
  },
  {
    Icon: Users,
    title: 'Team Alignment',
    body: 'Every agent sees the same board. Assign leads, log calls and emails, and keep the whole team moving together.',
  },
];

const PROOF_POINTS = [
  'Shared deal board across your team',
  'Full activity log per lead',
  'Agent leaderboard and metrics',
  'Drag-and-drop stage management',
  'Slide-in lead creation form',
  'Secure, persistent local data',
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--parchment)' }}>
      {/* Navbar */}
      <header
        className="sticky top-0 z-20 border-b border-border backdrop-blur-sm"
        style={{ background: 'color-mix(in srgb, var(--parchment) 95%, transparent)' }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <span
            className="text-2xl font-semibold text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AgencyFlow
          </span>
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 px-3 py-2"
            >
              Sign In
            </Link>
            <Button asChild size="sm" className="font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/signup">Begin Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/14465481/pexels-photo-14465481.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="City skyline viewed from a luxury penthouse"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/62" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <p
              className="uppercase tracking-[0.12em] text-[0.7rem] font-semibold mb-5 text-primary"
            >
              Premium Agency CRM
            </p>
            <h1
              className="text-4xl md:text-6xl font-semibold leading-[1.12] mb-6"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--cream-heading)' }}
            >
              Close More.
              <br />
              Track Everything.
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              AgencyFlow gives your boutique agency a visual pipeline to move high-value deals
              forward — with shared activity logs, agent metrics, and the focus of a tool built
              for serious brokers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="font-semibold tracking-wide text-base bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/signup">
                  Open Your Pipeline <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground/90 hover:border-primary-foreground/60 bg-transparent hover:bg-transparent font-medium"
              >
                <Link to="/login">Already a member</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand stripe */}
      <div
        className="h-1 w-full bg-primary"
        aria-hidden="true"
      />

      {/* Features */}
      <section className="py-20 md:py-28 bg-card">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-12 md:mb-16">
            <p
              className="uppercase tracking-[0.1em] text-[0.68rem] font-semibold mb-3 text-primary"
            >
              Why AgencyFlow
            </p>
            <h2
              className="text-3xl md:text-4xl font-semibold text-foreground"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Built for the way real agencies work
            </h2>
            <div className="mt-4 h-px w-16 bg-primary" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="group p-7 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-[160ms]"
                style={{ background: 'var(--parchment)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 bg-primary/12">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3
                  className="text-lg font-semibold text-foreground mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / checklist */}
      <section className="py-16 md:py-24" style={{ background: 'var(--navy)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="uppercase tracking-[0.1em] text-[0.68rem] font-semibold mb-4 text-primary"
              >
                Everything your team needs
              </p>
              <h2
                className="text-3xl md:text-4xl font-semibold leading-tight mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--cream-heading)' }}
              >
                A complete CRM in one focused workspace
              </h2>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Most CRMs were built for enterprise sales teams. AgencyFlow was designed for
                boutique agencies where every deal is personal and the whole team needs to stay
                in step.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROOF_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle
                    size={15}
                    className="mt-0.5 flex-shrink-0 text-primary"
                  />
                  <span className="text-sm" style={{ color: 'var(--cream-body)' }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-16 md:py-20 text-center bg-primary/8">
        <div className="max-w-xl mx-auto px-4 md:px-8">
          <h2
            className="text-3xl md:text-4xl font-semibold text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your first deal is one click away.
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            No subscription. No credit card. Open your pipeline in under a minute.
          </p>
          <Button asChild size="lg" className="font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/signup">
              Get Started <ArrowRight size={15} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8" style={{ background: 'var(--parchment)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-lg font-medium text-foreground/60"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AgencyFlow
          </span>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AgencyFlow. Built for serious brokers.
          </p>
        </div>
      </footer>
    </div>
  );
}
