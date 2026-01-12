import React, { useState } from 'react';
import { Shield, Activity, BarChart3, AlertCircle } from 'lucide-react';

function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-purple-500/30">
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Shield className="w-8 h-8 text-purple-500" />
                            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                PulseTrace
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <Activity className="w-5 h-5 text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
                            <BarChart3 className="w-5 h-5 text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <AlertCircle className="text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Real-time Ingestion</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Capture performance metrics and errors as they happen with sub-millisecond latency.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Shield className="text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Secure & Scalable</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Enterprise-grade security for your monitoring data with unlimited horizontal scaling.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Activity className="text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Deep Insights</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Analyze bottlenecks and stack traces with our advanced visualization engine.
                        </p>
                    </div>
                </div>

                <section className="mt-20 text-center">
                    <h2 className="text-4xl font-bold mb-6">Start Monitoring Everything.</h2>
                    <button className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors shadow-2xl shadow-white/5">
                        Integrate SDK
                    </button>
                </section>
            </main>
        </div>
    );
}

export default App;
