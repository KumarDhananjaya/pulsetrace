import { Link } from 'react-router-dom';
import { Shield, Zap, Database, ArrowRight, MousePointer2, Code2, Layout, Activity, Clock, Search } from 'lucide-react';

export const Features = () => {
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
                    <div className="flex items-center gap-6">
                        <Link to="/features" className="text-sm font-medium text-white">Features</Link>
                        <Link to="/pricing" className="text-sm font-medium hover:text-white transition-colors">Pricing</Link>
                        <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Sign in</Link>
                        <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-all">
                            Start for free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <header className="pt-32 pb-20 px-6 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8">
                        Everything in one place
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-8 max-w-3xl">
                        Unify your <span className="text-indigo-400">Visibility.</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                        PulseTrace brings logs, uptime, and error tracking into a single state-of-the-art interface. Stop switching tools, start solving issues.
                    </p>
                </div>
            </header>

            {/* Pillar: Error Tracking */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                            <Shield size={28} />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Real-time Error Tracking</h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Catch every exception before your users do. PulseTrace groups errors by fingerprint, provides full stack traces, and reconstructs the user journey with breadcrumbs.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {[
                                { icon: MousePointer2, label: "Automatic Breadcrumbs (DOM/Console/Fetch)" },
                                { icon: Code2, label: "Source Map Support for minified code" },
                                { icon: Layout, label: "Environment & Release context" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <item.icon size={18} className="text-indigo-500" />
                                    <span className="font-medium">{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] p-8 aspect-video flex flex-col justify-center gap-4">
                            <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                            <div className="h-4 w-1/2 bg-slate-800 rounded animate-pulse delay-75"></div>
                            <div className="h-24 w-full bg-slate-800 rounded mt-4 overflow-hidden border border-white/5 font-mono text-[10px] p-4 text-indigo-400 space-y-2">
                                <div>TypeError: Cannot read property 'id' of undefined</div>
                                <div className="pl-4 opacity-50">&gt; at AuthProvider.tsx:42:15</div>
                                <div className="pl-4 opacity-50">&gt; at renderWithHooks.js:14:18</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillar: Uptime */}
            <section className="py-32 px-6 bg-[#0a0b14]/50 border-y border-white/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] p-8 aspect-video flex flex-col justify-between overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex gap-1">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className={`h-8 w-1.5 rounded-full ${i === 15 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                    ))}
                                </div>
                                <div className="text-2xl font-bold text-white">99.9%</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-widest">
                                    <span>Latency</span>
                                    <span>240ms</span>
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-amber-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 text-right md:text-left">
                        <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-6 ml-auto md:ml-0">
                            <Zap size={28} />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Synthetic Monitoring</h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Monitor your APIs and services from around the globe. Get instant alerts when your services go down or latency spikes beyond your SLAs.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {[
                                { icon: Activity, label: "HTTP, SSL, and DNS checks" },
                                { icon: Clock, label: "1-minute check intervals" },
                                { icon: Zap, label: "Global check nodes" }
                            ].map((item, i) => (
                                <li key={i} className="flex flex-row-reverse md:flex-row items-center gap-3 text-slate-300">
                                    <item.icon size={18} className="text-amber-500" />
                                    <span className="font-medium">{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Pillar: Logs */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center mb-6">
                            <Database size={28} />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Log Management</h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Powerful centralized logging with structured metadata support. Index everything and find what you need in milliseconds.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {[
                                { icon: Search, label: "Instant full-text search" },
                                { icon: Code2, label: "JSONB structured metadata" },
                                { icon: Database, label: "Scalable ingestion at 50ms latency" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <item.icon size={18} className="text-sky-500" />
                                    <span className="font-medium">{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-black rounded-[2rem] border border-white/10 p-6 aspect-video overflow-hidden group shadow-2xl">
                            <div className="font-mono text-[11px] space-y-1">
                                <div className="text-slate-500">[18:24:01] <span className="text-sky-400">INFO</span> Request processed in 42ms</div>
                                <div className="text-slate-500">[18:24:03] <span className="text-amber-400">WARN</span> Slow DB query: SELECT * FROM users</div>
                                <div className="text-slate-500">[18:24:05] <span className="text-sky-400">INFO</span> Worker healthy</div>
                                <div className="text-slate-500">[18:24:10] <span className="text-sky-400">INFO</span> Deployment v1.4.2 complete</div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-6 right-6">
                                <div className="bg-slate-900 border border-white/10 rounded-lg p-2 flex items-center gap-2">
                                    <Search size={14} className="text-slate-500" />
                                    <div className="text-xs text-slate-400">Search logs...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solutions CTA */}
            <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0a0b14]/80">
                <div className="max-w-4xl mx-auto text-center bg-slate-900 rounded-[3rem] p-12 md:p-20 border border-white/5">
                    <h2 className="text-4xl font-bold text-white mb-6">Need a custom solution?</h2>
                    <p className="text-slate-400 text-lg mb-10">
                        Check out our dedicated solutions for startup agility and enterprise reliability.
                    </p>
                    <Link to="/solutions" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-slate-200 transition-all">
                        Explore Solutions <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-medium text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white rounded flex items-center justify-center font-bold text-black text-[10px] italic">P</div>
                        <span className="text-white normal-case text-base tracking-tight font-bold">PulseTrace</span>
                    </div>
                    <div className="flex gap-8">
                        <Link to="/features" className="text-white hover:text-white transition-colors">Features</Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    </div>
                    <p className="normal-case">© 2026 PulseTrace Inc.</p>
                </div>
            </footer>
        </div>
    );
};
