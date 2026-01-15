import { Settings, Key, Bell, Shield, Trash2, Globe, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const ProjectSettingsFull = () => {
    const [isCopied, setIsCopied] = useState(false);
    const apiKey = "pt_live_32c5ecd74a1e431290782e51d4785ac5";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl space-y-12 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Project Settings</h2>
                <p className="text-slate-400 mt-2">Manage your project configuration and API safety.</p>
            </div>

            <section className="space-y-6">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <Key size={20} className="text-amber-400" />
                    API Credentials
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Project ID</label>
                        <code className="text-sm text-slate-300 bg-black/30 px-3 py-2 rounded-lg block w-fit border border-white/5">
                            32c5ecd7-4a1e-4312-9078-2e51d4785ac5
                        </code>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Public DSN</label>
                        <div className="flex gap-2">
                            <code className="flex-1 text-sm text-indigo-300 bg-black/30 px-3 py-2 rounded-lg border border-indigo-500/10 font-mono break-all">
                                https://api.pulsetrace.com/collect?key={apiKey}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all active:scale-95"
                            >
                                {isCopied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <Bell size={20} className="text-indigo-400" />
                    Global Alerts
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-white">Email Notifications</h4>
                            <p className="text-xs text-slate-500 mt-1">Alerts sent to all team members</p>
                        </div>
                        <div className="w-12 h-6 bg-indigo-600 rounded-full relative shadow-inner">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all">
                        <div>
                            <h4 className="font-bold text-white">Slack Webhook</h4>
                            <p className="text-xs text-slate-500 mt-1 italic">Configure Slack integration</p>
                        </div>
                        <Settings size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </section>

            <section className="pt-8 mt-12 border-t border-rose-500/10">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-lg mb-4">
                    <Trash2 size={20} />
                    Danger Zone
                </div>
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="font-bold text-white">Delete this project</h4>
                        <p className="text-sm text-slate-500 mt-1">Once deleted, all data including historical logs and performance metrics will be purged forever.</p>
                    </div>
                    <button className="whitespace-nowrap px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-900/20 active:scale-95">
                        Destroy Project
                    </button>
                </div>
            </section>
        </div>
    );
};
