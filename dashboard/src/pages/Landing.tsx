import { Link } from 'react-router-dom';
import { Shield, Zap, Database, ArrowRight, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Landing = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            title: "Error Tracking",
            description: "Real-time error monitoring with high-fidelity stack traces and automatic fingerprinting.",
            icon: Shield,
            color: "text-indigo-400",
            bg: "bg-indigo-400/10"
        },
        {
            title: "Uptime Monitoring",
            description: "Globally distributed uptime checks that monitor your endpoints 24/7 with instant alerts.",
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-400/10"
        },
        {
            title: "Log Management",
            description: "Centralized log ingestion and search with structured metadata support for deep insights.",
            icon: Database,
            color: "text-sky-400",
            bg: "bg-sky-400/10"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0b14] text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-[#0a0b14]/80 backdrop-blur-md border-white/10 py-3' : 'bg-transparent border-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white italic shadow-lg shadow-indigo-500/20">
                            P
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                            PulseTrace
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium hover:text-white transition-colors">Features</a>
                        <a href="#solutions" className="text-sm font-medium hover:text-white transition-colors">Solutions</a>
                        <a href="#pricing" className="text-sm font-medium hover:text-white transition-colors">Pricing</a>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Sign in</Link>
                        <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-all active:scale-95">
                            Start for free
                        </Link>
                    </div>

                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#0a0b14] pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top">
                    <div className="flex flex-col gap-6 text-xl font-medium">
                        <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
                        <a href="#solutions" onClick={() => setIsMenuOpen(false)}>Solutions</a>
                        <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                        <hr className="border-white/10" />
                        <Link to="/login">Sign in</Link>
                        <Link to="/register" className="bg-indigo-600 text-white p-4 rounded-xl text-center">Start for free</Link>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
                    <div className="absolute top-[-100px] left-[-200px] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute top-[200px] right-[-200px] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 animate-in slide-in-from-bottom duration-500">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
                            Now Live: Log Management
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 animate-in slide-in-from-bottom duration-700">
                            Observe. Trace. <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Pulse.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto animate-in slide-in-from-bottom duration-1000">
                            The observability platform for modern engineering teams. Error tracking, uptime monitoring, and logs in one state-of-the-art interface.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom duration-1000">
                            <Link to="/register" className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 group">
                                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#docs" className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold border border-white/10 hover:bg-white/5 transition-all text-white">
                                View Documentation
                            </a>
                        </div>
                    </div>

                    {/* Hero Mockup */}
                    <div className="mt-20 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-slate-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                            <img
                                src="/images/hero-mockup.png"
                                alt="PulseTrace Dashboard"
                                className="w-full h-auto brightness-90 group-hover:brightness-100 transition duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Trust */}
            <section className="py-12 border-y border-white/5 bg-[#0a0b14]/50">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-10">Trusted by modern stacks</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {/* Simple text logos for placeholder trust */}
                        <div className="text-2xl font-bold italic tracking-tighter">NODE.JS</div>
                        <div className="text-2xl font-bold tracking-tighter">REACT</div>
                        <div className="text-2xl font-bold tracking-tighter">NEXT.JS</div>
                        <div className="text-2xl font-bold tracking-tighter">PYTHON</div>
                        <div className="text-2xl font-bold tracking-tighter">DOCKER</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                        <div className="max-w-2xl">
                            <h2 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">The Platform</h2>
                            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Everything you need to ship stable code.</h3>
                        </div>
                        <p className="text-slate-400 text-lg max-w-sm">
                            Stop switching between tabs. Get the full picture of your infrastructure in one place.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${f.bg} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-xl flex items-center justify-center mb-6 shadow-inner`}>
                                    <f.icon size={24} />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-4">{f.title}</h4>
                                <p className="text-slate-400 leading-relaxed mb-8">{f.description}</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                                    Learn more <ArrowRight size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bento Section (BetterStack inspired) */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
                        <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 flex flex-col justify-between text-white overflow-hidden relative group">
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mb-32"></div>
                            <div>
                                <h3 className="text-4xl font-bold mb-4 tracking-tight">Native Breadcrumbs</h3>
                                <p className="text-shadow-sm text-indigo-100/80 max-w-xs">
                                    Automatically track user clicks, console logs, and network requests leading up to an error.
                                </p>
                            </div>
                            <div className="relative mt-8 bg-black/20 rounded-2xl p-4 border border-white/10 backdrop-blur-sm group-hover:scale-[1.02] transition-transform duration-500">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-xs opacity-60"><div className="w-2 h-2 rounded-full bg-blue-400"></div> CLICK: button#login</div>
                                    <div className="flex items-center gap-3 text-xs opacity-60"><div className="w-2 h-2 rounded-full bg-green-400"></div> FETCH: /api/auth (200)</div>
                                    <div className="flex items-center gap-3 text-xs"><div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div> ERROR: uncaught TypeError</div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Automated PII Scrubbing</h3>
                            <p className="text-slate-400">Keep sensitive user data out of your logs automatically. GDPR compliance from day one.</p>
                        </div>

                        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center text-center">
                            <div className="text-4xl font-bold text-indigo-400 mb-2">50ms</div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ingestion Latency</p>
                        </div>

                        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center">
                            <div className="flex -space-x-3 mb-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0b14] bg-slate-800 flex items-center justify-center text-xs">U{i}</div>
                                ))}
                            </div>
                            <p className="text-white font-medium">Team Ready</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-indigo-900/40 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-indigo-500/10 pointer-events-none"></div>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready for a better pulse?</h3>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                            Join 2,000+ developers monitoring their applications with PulseTrace. No credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-slate-200 transition-all active:scale-95">
                                Start your free trial
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto px-10 py-4 rounded-full text-lg font-bold text-white hover:bg-white/5 transition-all">
                                Talk to sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pb-20 pt-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center font-bold text-black text-xs italic">
                                P
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">
                                PulseTrace
                            </span>
                        </div>
                        <div className="flex gap-10 text-sm font-medium text-slate-500">
                            <a href="#" className="hover:text-white transition-colors">Documentation</a>
                            <a href="#" className="hover:text-white transition-colors">Changelog</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                        <div className="text-sm text-slate-600">
                            © 2026 PulseTrace Inc. Built for the modern web.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
