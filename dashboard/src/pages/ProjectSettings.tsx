import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, Terminal, Key } from 'lucide-react';

export const ProjectSettings = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id || !user) return;
        fetch(`http://localhost:3001/api/projects/${id}`, {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(setProject)
            .catch(console.error);
    }, [id, user]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!project) return <div className="p-12 text-center text-slate-500">Loading settings...</div>;

    const dsn = `https://api.pulsetrace.com/collect?api_key=${project.apiKey}`;
    const snippet = `
import { PulseTrace } from '@pulsetrace/sdk';

PulseTrace.init({
    dsn: "${dsn}",
    release: "v1.0.0",
    environment: "production"
});
`.trim();

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
                <p className="text-slate-400">Project Settings and Integration</p>
            </div>

            {/* API Key Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                    <Key size={18} className="text-indigo-400" />
                    <h3 className="font-semibold text-white">Client Keys (DSN)</h3>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-400">Use this DSN to configure the SDK in your application.</p>
                    <div className="relative group">
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 break-all pr-12">
                            {dsn}
                        </div>
                        <button
                            onClick={() => copyToClipboard(dsn)}
                            className="absolute right-2 top-2 p-2 text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                        >
                            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Integration Guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                    <Terminal size={18} className="text-indigo-400" />
                    <h3 className="font-semibold text-white">Integration</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-white mb-2">1. Install the SDK</h4>
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-indigo-300">
                            npm install @pulsetrace/sdk
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-white mb-2">2. Initialize in your App</h4>
                        <p className="text-xs text-slate-500 mb-2">Add this as early as possible in your application entry point.</p>
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre overflow-x-auto">
                            {snippet}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
