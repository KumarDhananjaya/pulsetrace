import { Smartphone, Zap, Shield, Layers, Terminal } from 'lucide-react';

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

export const MobileSDK = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
                <Smartphone size={18} />
                <span>SDK Guides</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">React Native Integration</h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                PulseTrace Mobile SDK is optimized for React Native, providing deep instrumentation into the Javascript bridge, native exceptions, and mobile-specific performance metrics.
            </p>

            <section className="space-y-6 mb-16">
                <h2 className="text-2xl font-bold text-white tracking-tight">1. Installation</h2>
                <p className="text-slate-400">Add the mobile SDK and its peer dependencies to your React Native project.</p>
                <CodeBlock code="npm install @pulsetrace/react-native" language="bash" />
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-sm italic">
                    Note: For iOS, remember to run `cd ios && pod install` after installation.
                </div>
            </section>

            <section className="space-y-6 mb-16">
                <h2 className="text-2xl font-bold text-white tracking-tight">2. Basic Configuration</h2>
                <p className="text-slate-400">Initialize the SDK at the top of your `index.js` or `App.tsx` file.</p>
                <CodeBlock
                    language="typescript"
                    code={`import * as PulseTrace from '@pulsetrace/react-native';

PulseTrace.init({
    dsn: "YOUR_DSN_HERE",
    enableNative: true, // Captures C++/Java/Obj-C crashes
    enableAnrDetection: true, // Detects Application Not Responding
    debug: false
});`}
                />
            </section>

            <section className="space-y-6 mb-16">
                <h2 className="text-2xl font-bold text-white tracking-tight">Mobile Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                        <Shield className="text-indigo-400 mb-4" size={24} />
                        <h3 className="font-bold text-white mb-2">Native Crash Reporting</h3>
                        <p className="text-sm text-slate-400">Captures Fatal signals and Uncaught Exceptions in Java/Kotlin and Objective-C/Swift.</p>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                        <Zap className="text-amber-400 mb-4" size={24} />
                        <h3 className="font-bold text-white mb-2">Device Metadata</h3>
                        <p className="text-sm text-slate-400">Automatically attaches device model, battery level, storage status, and network type to every event.</p>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                        <Layers className="text-sky-400 mb-4" size={24} />
                        <h3 className="font-bold text-white mb-2">Navigation Tracking</h3>
                        <p className="text-sm text-slate-400">Deep integration with React Navigation to track screen transactions and TTFD (Time To Full Display).</p>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                        <Terminal className="text-emerald-400 mb-4" size={24} />
                        <h3 className="font-bold text-white mb-2">Log Buffering</h3>
                        <p className="text-sm text-slate-400">Buffers logs locally when offline and syncs them as soon as connectivity is restored.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
