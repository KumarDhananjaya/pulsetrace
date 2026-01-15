import { Share2, Zap, Database, Shield, Radio, Activity } from 'lucide-react';

export const Architecture = () => {
    return (
        <div className="animate-in fade-in duration-700">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
                <Share2 size={18} />
                <span>Internal Architecture</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">System Architecture</h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                PulseTrace is designed for high-throughput event ingestion and real-time processing using a distributed monorepo architecture.
            </p>

            <div className="space-y-16">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Data Flow Diagram</h2>
                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-8">
                        <div className="flex justify-between items-center px-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                                    <Activity size={32} />
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">SDKs</span>
                            </div>
                            <div className="w-full h-[2px] bg-indigo-500/20 mx-4"></div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400">
                                    <Radio size={32} />
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">API Gateway</span>
                            </div>
                            <div className="w-full h-[2px] bg-violet-500/20 mx-4"></div>
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                                    <Database size={32} />
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Storage</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-8">
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Zap className="text-amber-400" size={18} />
                            Ingestion Pipeline
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Events are received by the Express API, validated using Zod, and then pushed to a Redis-backed queue (BullMQ) for asynchronous processing.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Shield className="text-sky-400" size={18} />
                            Security Layer
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            PulseTrace employs an Enterprise Identity layer with PKCE, Secure Cookies, and automatic Refresh Token Rotation for maximum reliability.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
