import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';

const SocialButton = ({ provider, icon: Icon }: { provider: string, icon: any }) => (
    <a
        href={`http://localhost:3001/auth/oauth/${provider.toLowerCase()}`}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-medium text-sm text-white"
    >
        <Icon className="w-5 h-5" />
        Sign up with {provider}
    </a>
);

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const AppleIcon = () => (
    <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-22.1-85.7-22.1-55.5.3-104.2 31.6-133 81.3-30.8 53-24.8 126.9 8.2 186 16.4 29.5 37.1 55.4 65.3 55.4 20.3 0 28.5-12.8 54.3-12.8 25.8 0 33.7 12.8 54.7 12.8 28.1 0 52-30.9 66.1-55.5 16.9-24.7 23.9-48.7 24.3-49.8-.8-.3-44.1-17-44.4-66.9zM224 80c16.3-21.2 27.3-48.4 24.3-76-23.3 1.9-51.4 16.5-68.1 36.4-15.1 17.8-28.3 46-24.3 72 25.3 2.1 51.9-11.2 68.1-32.4z" />
    </svg>
);

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include'
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            login(null as any, data.user);
            navigate('/app');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0b14] flex flex-col items-center justify-center p-6 text-slate-300 font-sans">
            <Link to="/" className="mb-10 flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white italic group-hover:scale-105 transition-transform shadow-xl shadow-indigo-500/20">
                    P
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">PulseTrace</span>
            </Link>

            <div className="w-full max-w-md">
                <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50"></div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create your account</h1>
                        <p className="text-slate-500 text-sm">Start monitoring your services in minutes</p>
                    </div>

                    <div className="space-y-3 mb-8">
                        <SocialButton provider="Google" icon={GoogleIcon} />
                        <SocialButton provider="GitHub" icon={() => (
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                        )} />
                    </div>

                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <span className="relative px-4 bg-[#0F111A] text-[10px] uppercase font-bold tracking-[0.2em] text-slate-600">Or use your email</span>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-xl text-xs mb-6 text-center animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all text-sm"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all text-sm"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group w-full bg-white text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 hover:bg-slate-200 active:scale-[0.98] shadow-xl shadow-white/5"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-10">
                        <p className="text-xs text-slate-500">
                            Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>

                <p className="mt-12 text-center text-[10px] text-slate-600 uppercase tracking-widest leading-loose">
                    By creating an account, you agree to our <a href="#" className="underline hover:text-slate-400">Terms of Service</a><br />and <a href="#" className="underline hover:text-slate-400">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};
