import { Rocket, Terminal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const Quickstart = () => {
    return (
        <div className="animate-in fade-in duration-700">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
                <Rocket size={18} />
                <span>Getting Started</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Quickstart</h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                Learn how to integrate PulseTrace and start monitoring your application in under 5 minutes.
            </p>

            <div className="grid grid-cols-1 gap-12">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold">1</span>
                        Install the SDK
                    </h2>
                    <p className="text-slate-400 mb-6">First, install the PulseTrace SDK in your project via npm or yarn.</p>
                    <CodeBlock code="npm install @pulsetrace/sdk" language="bash" />
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold">2</span>
                        Initialize and Configure
                    </h2>
                    <p className="text-slate-400 mb-6">Add the initialization snippet to your entry point (e.g., `index.js` or `App.tsx`).</p>
                    <CodeBlock
                        language="typescript"
                        code={`import { PulseTrace } from '@pulsetrace/sdk';

PulseTrace.init({
    dsn: "https://api.pulsetrace.com/collect?api_key=YOUR_API_KEY",
    release: "v1.0.0",
    environment: "production",
    debug: true
});`}
                    />
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold">3</span>
                        Capture Your First Event
                    </h2>
                    <p className="text-slate-400 mb-6 font-medium">Capture exceptions manually or let PulseTrace handle them automatically.</p>
                    <CodeBlock
                        language="typescript"
                        code={`try {
    throw new Error("Something went wrong!");
} catch (e) {
    PulseTrace.captureException(e);
}`}
                    />
                </section>
            </div>

            <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">Ready to go deeper?</h3>
                    <p className="text-slate-400">Explore our Web SDK guides for advanced configuration.</p>
                </div>
                <Link to="/docs/sdk-web" className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors">
                    SDK Guides <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
};
