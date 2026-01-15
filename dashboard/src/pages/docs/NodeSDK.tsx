import { Server, Shield, Layers, Terminal } from 'lucide-react';

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

export const NodeSDK = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
                <Server size={18} />
                <span>SDK Guides</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Node.js Integration</h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                Instrument your backend services with PulseTrace Node.js SDK to capture server-side errors, monitor database performance, and track distributed traces.
            </p>

            <section className="space-y-6 mb-16">
                <h2 className="text-2xl font-bold text-white tracking-tight">Installation</h2>
                <CodeBlock code="npm install @pulsetrace/node" language="bash" />
            </section>

            <section className="space-y-6 mb-16">
                <h2 className="text-2xl font-bold text-white tracking-tight">Express Middleware</h2>
                <p className="text-slate-400">PulseTrace integrates seamlessly with Express. Ensure the error handler is the LAST middleware added.</p>
                <CodeBlock
                    language="typescript"
                    code={`import express from 'express';
import * as PulseTrace from '@pulsetrace/node';

const app = express();

PulseTrace.init({ dsn: "YOUR_DSN" });

// The request handler must be the first middleware on the app
app.use(PulseTrace.Handlers.requestHandler());

app.get("/", (req, res) => {
  throw new Error("Broke on purpose!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(PulseTrace.Handlers.errorHandler());

app.listen(3000);`}
                />
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Shield size={20} />
                        </div>
                        <h3 className="font-bold text-white">Auto-Instrumentation</h3>
                        <p className="text-sm text-slate-400">Automatically instruments modules like `http`, `https`, `mongodb`, `pg`, `mysql2`, and `redis`.</p>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Layers size={20} />
                        </div>
                        <h3 className="font-bold text-white">Distributed Tracing</h3>
                        <p className="text-sm text-slate-400">Propagate trace headers across microservices using W3C Trace Context standard.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
