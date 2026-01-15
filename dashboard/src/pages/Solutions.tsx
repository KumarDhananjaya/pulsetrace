import { Link } from 'react-router-dom';
import { Rocket, Building2, Terminal, ArrowRight, ShieldCheck, Zap, BarChart } from 'lucide-react';

export const Solutions = () => {
    return (
        <div className="min-h-screen bg-[#0a0b14] text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#0a0b14]/80 backdrop-blur-md border-b border-white/10 py-4">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white italic group-hover:scale-105 transition-transform">
                            P
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">PulseTrace</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link to="/features" className="text-sm font-medium hover:text-white transition-colors">Features</Link>
                        <Link to="/pricing" className="text-sm font-medium hover:text-white transition-colors">Pricing</Link>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Sign in</Link>
                        <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold">Start for free</Link>
                    </div>
                </div>
            </nav>

            <header className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-8">
                        Built for your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Scale.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Tailored observability solutions for every stage of your engineering journey. From side projects to hypergrowth.
                    </p>
                </div>
            </header>

            {/* Solution: Startups */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div className="p-10 rounded-[3rem] bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -mr-32 -mt-32"></div>
                        <Rocket size={48} className="text-indigo-400 mb-8" />
                        <h2 className="text-3xl font-bold text-white mb-4">PulseTrace for Startups</h2>
                        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                            Ship faster with zero-config observability. Get global visibility with a single line of code and stay within your budget.
                        </p>
                        <ul className="space-y-4 mb-8 text-sm">
                            <li className="flex items-center gap-3"><Zap size={16} className="text-indigo-400" /> Free 14-day Pro trial</li>
                            <li className="flex items-center gap-3"><Zap size={16} className="text-indigo-400" /> Generous Free Tier forever</li>
                            <li className="flex items-center gap-3"><Zap size={16} className="text-indigo-400" /> Direct Slack support from founders</li>
                        </ul>
                        <Link to="/register" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:gap-3 transition-all">
                            Claim startup credit <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-slate-900 border border-white/5 relative overflow-hidden">
                        <Building2 size={48} className="text-slate-400 mb-8" />
                        <h2 className="text-3xl font-bold text-white mb-4">PulseTrace for Enterprise</h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Bank-level security, custom data residency, and RBAC to manage massive engineering teams with confidence.
                        </p>
                        <ul className="space-y-4 mb-8 text-sm">
                            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-emerald-400" /> SSO / SAML Enforcement</li>
                            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-emerald-400" /> SOC2 Type II Compliant</li>
                            <li className="flex items-center gap-3"><ShieldCheck size={16} className="text-emerald-400" /> 99.99% Availability SLA</li>
                        </ul>
                        <Link to="/contact" className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all">
                            Talk to enterprise sales <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Solution: SRE Teams */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-white mb-4 italic">PulseTrace for SRE & DevOps</h2>
                        <p className="text-slate-400 text-lg">Infrastructure-level insights for the teams that keep the lights on.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5">
                            <Terminal className="text-indigo-400 mb-6" />
                            <h4 className="text-xl font-bold text-white mb-4">Custom Alert Rules</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Define complex thresholds and alert conditions using our powerful rule engine and expression language.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5">
                            <BarChart className="text-purple-400 mb-6" />
                            <h4 className="text-xl font-bold text-white mb-4">Metric Aggregations</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Aggregated performance metrics (LCP, FID, CLS) across all projects with historical trend analysis.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/5">
                            <ShieldCheck className="text-sky-400 mb-6" />
                            <h4 className="text-xl font-bold text-white mb-4">Data Sovereignty</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Choose your data region (EU, US, Asia) to meet local compliance and performance requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-center gap-10 text-xs font-bold text-slate-500 uppercase tracking-widest mb-10">
                        <Link to="/features" className="hover:text-white transition-colors">Features</Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <Link to="/solutions" className="text-white hover:text-white transition-colors">Solutions</Link>
                    </div>
                    <p className="text-xs text-slate-600">© 2026 PulseTrace Inc. Built for every engineering team.</p>
                </div>
            </footer>
        </div>
    );
};
