import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);

    const tiers = [
        {
            name: "Free",
            price: "0",
            description: "Perfect for hobbyists and solo developers.",
            features: [
                "10 monitors & heartbeats",
                "3GB log ingestion/mo",
                "3 days log retention",
                "Slack & Email alerts",
                "1 Status Page",
                "Community support"
            ],
            cta: "Get Started",
            highlight: false
        },
        {
            name: "Pro",
            price: "29",
            description: "For teams that need deeper observability.",
            features: [
                "50 monitors & heartbeats",
                "25GB log ingestion/mo",
                "30 days log retention",
                "Unlimited alerts & webhooks",
                "5 Status Pages (Custom Domains)",
                "Priority email support",
                "Phone/SMS/Push notifications"
            ],
            cta: "Start 14-day Trial",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Complete isolation and custom compliance.",
            features: [
                "Unlimited monitors",
                "Custom data residency",
                "Unlimited log retention",
                "Multi-region failover",
                "Dedicated Success Manager",
                "SLA Guarantees",
                "SSO & RBAC Enforcement"
            ],
            cta: "Contact Sales",
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0b14] text-slate-300 font-sans selection:bg-indigo-500/30">
            {/* Global Navbar (Simplified for subpages) */}
            <nav className="fixed top-0 w-full z-50 bg-[#0a0b14]/80 backdrop-blur-md border-b border-white/10 py-4">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white italic group-hover:scale-105 transition-transform">
                            P
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">PulseTrace</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/features" className="text-sm font-medium hover:text-white transition-colors">Features</Link>
                        <Link to="/pricing" className="text-sm font-medium text-white">Pricing</Link>
                        <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Sign in</Link>
                        <Link to="/register" className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-all">
                            Start for free
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Simple, transparent pricing.</h1>
                    <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                        Whether you're a solo dev or a global enterprise, we have a plan that scales with your infrastructure.
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-16">
                        <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-12 h-6 rounded-full bg-slate-800 p-1 relative transition-colors"
                        >
                            <div className={`w-4 h-4 bg-indigo-500 rounded-full transition-all ${isYearly ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-slate-500'}`}>Yearly (Save 20%)</span>
                    </div>

                    {/* Tiers Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {tiers.map((tier, i) => (
                            <div key={i} className={`relative p-8 rounded-[2.5rem] border ${tier.highlight ? 'bg-slate-900 border-indigo-500/50 shadow-2xl shadow-indigo-500/10' : 'bg-slate-900/50 border-white/5'} flex flex-col items-start text-left group hover:scale-[1.02] transition-all duration-500`}>
                                {tier.highlight && (
                                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-extrabold text-white">
                                        {tier.price === "Custom" ? "" : "$"}
                                        {tier.price === "Custom" ? "Custom" : (isYearly && tier.price !== "0" ? Math.floor(parseInt(tier.price) * 0.8) : tier.price)}
                                    </span>
                                    {tier.price !== "Custom" && <span className="text-slate-500 font-medium">/mo</span>}
                                </div>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed h-10">{tier.description}</p>

                                <Link
                                    to="/register"
                                    className={`w-full py-4 rounded-2xl text-center font-bold text-sm mb-10 transition-all ${tier.highlight ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                                >
                                    {tier.cta}
                                </Link>

                                <div className="space-y-4 w-full">
                                    {tier.features.map((feature, j) => (
                                        <div key={j} className="flex items-center gap-3 text-sm">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tier.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-500'}`}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed Comparison Link */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Need something more specific?</h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                            We offer custom ingestion and retention volumes for high-traffic applications.
                        </p>
                        <button className="text-indigo-400 font-bold flex items-center gap-2 mx-auto hover:text-indigo-300 transition-colors">
                            Talk to our engineering team <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ Section (Mini) */}
            <section className="py-20 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="grid gap-8">
                        {[
                            { q: "How are monitors counted?", a: "Each individual URL or cron job heartbeat you track is counted as one monitor. Status pages are separate." },
                            { q: "Can I upgrade or downgrade anytime?", a: "Yes, you can change your plan at any time from your billing settings. Changes are prorated." },
                            { q: "Do you offer an open source discount?", a: "Absolutely! Contact us for free Pro access for public open source projects." }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                <h4 className="text-white font-bold mb-2">{faq.q}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Footer (Simplified) */}
            <footer className="py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center font-bold text-black text-xs italic">P</div>
                        <span className="text-lg font-bold text-white">PulseTrace</span>
                    </div>
                    <div className="flex gap-8 text-xs font-medium text-slate-500 uppercase tracking-widest">
                        <Link to="/features" className="hover:text-white transition-colors">Features</Link>
                        <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    </div>
                    <p className="text-xs text-slate-600">© 2026 PulseTrace Inc.</p>
                </div>
            </footer>
        </div>
    );
};
