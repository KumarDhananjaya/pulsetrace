import { Terminal, Database, Shield, Zap, Info } from 'lucide-react';

const CodeBlock = ({ code, language }: { code: string, language: string }) => (
    <div className="relative group my-8">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800/50">
            <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span>{language}</span>
                <button className="hover:text-white transition-colors"><Terminal size={12} /></button>
            </div>
            <pre className="p-6 overflow-x-auto">
                <code className="text-sm text-indigo-300 font-mono leading-relaxed">{code}</code>
            </pre>
        </div>
    </div>
);

export const IngestionAPI = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
                <Terminal size={18} />
                <span>API Reference</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Ingestion API</h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                Submit raw events, logs, and metrics directly to our high-throughput ingestion clusters using standard HTTP requests.
            </p>

            <section className="space-y-6 mb-16">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded uppercase">POST</span>
                    <code className="text-indigo-400 font-bold">/api/collect</code>
                </div>
                <p className="text-slate-400">The primary endpoint for all SDK events. Requires a valid API Key passed via query parameters or headers.</p>

                <h3 className="text-lg font-bold text-white mt-8 mb-4">Authentication</h3>
                <CodeBlock
                    language="bash"
                    code={`curl -X POST "https://api.pulsetrace.com/api/collect?api_key=pt_live_12345" \\
     -H "Content-Type: application/json" \\
     -d '{ "event": "error", "message": "API Test" }'`
                    }
                />
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Event Schema</h2>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50">
                                <th className="px-6 py-4 font-bold text-slate-300">Field</th>
                                <th className="px-6 py-4 font-bold text-slate-300">Type</th>
                                <th className="px-6 py-4 font-bold text-slate-300">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <tr>
                                <td className="px-6 py-4 font-mono text-indigo-400">type</td>
                                <td className="px-6 py-4 text-slate-500 italic">string</td>
                                <td className="px-6 py-4 text-slate-400">Required. Options: `error`, `log`, `perf`, `event`.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-indigo-400">timestamp</td>
                                <td className="px-6 py-4 text-slate-500 italic">ISO8601</td>
                                <td className="px-6 py-4 text-slate-400">Defaults to ingestion time if omitted.</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-mono text-indigo-400">tags</td>
                                <td className="px-6 py-4 text-slate-500 italic">Object</td>
                                <td className="px-6 py-4 text-slate-400">Key-value pairs for filtering and searching.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
