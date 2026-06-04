import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';

const LABEL_CLASS =
  'uppercase tracking-[0.08em] text-[0.65rem] font-semibold text-muted-foreground mb-1.5 block';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!password) e.password = 'Password is required.';
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
      const result = login(email.trim(), password);
      if (!result.ok) {
        toast.error(result.error ?? 'Sign-in failed.');
        setErrors({ password: result.error });
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
            Your pipeline,
            <br />
            your momentum.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--cream-body)' }}>
            Sign in to pick up exactly where you left off. Every deal, every note, every stage
            — waiting for you.
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
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your pipeline.
            </p>
          </div>

          <div
            className="h-px w-full mb-8 bg-primary/20"
            aria-hidden="true"
          />

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <Label htmlFor="email" className={LABEL_CLASS}>
                Email Address
              </Label>
              <Input
                id="email"
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
              <Label htmlFor="password" className={LABEL_CLASS}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to AgencyFlow?{' '}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
