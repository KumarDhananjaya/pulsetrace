import { Layers, Activity, Shield, Code, Server, Smartphone, Globe } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon }: any) => (
    <div className="p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl space-y-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Icon size={20} />
        </div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
);

export const SDKIntegration = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
                <Globe size={18} />
                <span>SDK Guides</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Web SDK Integration</h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                PulseTrace Web SDK provides seamless error tracking and performance monitoring for your React, Vue, and Vanilla JS applications.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-16">
                <FeatureCard
                    icon={Shield}
                    title="Error Tracking"
                    description="Automatically captures unhandled exceptions and promise rejections with full stack traces."
                />
                <FeatureCard
                    icon={Activity}
                    title="Core Web Vitals"
                    description="Monitors LCP, INP, and CLS out of the box to track your real user performance."
                />
                <FeatureCard
                    icon={Layers}
                    title="Breadcrumbs"
                    description="Tracks user interactions, console logs, and network requests before an error occurs."
                />
                <FeatureCard
                    icon={Code}
                    title="Fingerprinting"
                    description="Automatically groups similar errors to reduce noise in your dashboard."
                />
            </div>

            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Configuration Options</h2>
                <div className="overflow-hidden bg-slate-900 border border-slate-800 rounded-xl">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50">
                                <th className="px-6 py-4 font-bold text-slate-300">Property</th>
                                <th className="px-6 py-4 font-bold text-slate-300">Type</th>
                                <th className="px-6 py-4 font-bold text-slate-300">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <tr>
                                <td className="px-6 py-4 font-mono text-indigo-400">dsn</td>
                                <td className="px-6 py-4 text-slate-500 italic">string</td>
                                <td className="px-6 py-4 text-slate-400">The ingestion URL containing your API Key.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-indigo-400">environment</td>
                                <td className="px-6 py-4 text-slate-500 italic">string</td>
                                <td className="px-6 py-4 text-slate-400">e.g., 'production', 'staging'. Defaults to 'production'.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-indigo-400">debug</td>
                                <td className="px-6 py-4 text-slate-500 italic">boolean</td>
                                <td className="px-6 py-4 text-slate-400">Enables library internal logging. Useful for development.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
