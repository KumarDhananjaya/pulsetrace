import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckCircle, XCircle, Zap, Globe } from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

const UptimeBar = ({ history }: { history: any[] }) => (
    <div className="flex gap-[2px] h-8 items-end w-full">
        {(history || Array.from({ length: 48 })).map((h, i) => (
            <div
                key={i}
                className={`flex-1 rounded-sm transition-all hover:scale-y-125 cursor-pointer ${h?.status === 'up' ? 'bg-emerald-500/40 hover:bg-emerald-400' : 'bg-rose-500/40 hover:bg-rose-400'
                    }`}
                style={{ height: h ? '100%' : '60%' }}
                title={`${h?.timestamp}: ${h?.status === 'up' ? 'Online' : 'Offline'}`}
            ></div>
        ))}
    </div>
);

export const Uptime = () => {
    const { user } = useAuth();
    const demoData = useDemoData(true);
    const [monitors, setMonitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Modal State
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const fetchMonitors = () => {
        fetch('http://localhost:3001/api/projects', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(projects => {
                if (projects.length > 0) {
                    return fetch(`http://localhost:3001/api/projects/${projects[0].id}/monitors`, {
                        credentials: 'include'
                    }).then(res => res.json());
                }
                return [];
            })
            .then(data => {
                setMonitors(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        if (user) fetchMonitors();
        const interval = setInterval(fetchMonitors, 10000);
        return () => clearInterval(interval);
    }, [user]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const projects = await fetch('http://localhost:3001/api/projects', {
                credentials: 'include'
            }).then(res => res.json());

            if (projects.length === 0) return alert('Create a project first!');

            await fetch('http://localhost:3001/api/monitors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    url,
                    projectId: projects[0].id,
                    interval: 60
                })
            });
            setShowModal(false);
            setName('');
            setUrl('');
            fetchMonitors();
        } catch (e) {
            alert('Failed to create monitor');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Availability</h2>
                    <p className="text-slate-400 mt-2 text-lg">Global uptime monitoring and latency tracking.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    New Monitor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl"><CheckCircle size={28} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Global Health</p>
                        <p className="text-2xl font-bold text-white mt-1">99.98%</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl"><Zap size={28} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Avg Latency</p>
                        <p className="text-2xl font-bold text-white mt-1">142ms</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl"><Globe size={28} /></div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Check Points</p>
                        <p className="text-2xl font-bold text-white mt-1">12 Latency</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {monitors.length > 0 ? monitors.map((m: any) => (
                    <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 group hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl ${m.status === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {m.status === 'up' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-xl tracking-tight">{m.name}</h3>
                                    <a href={m.url} target="_blank" className="text-slate-400 text-sm hover:text-indigo-400 transition-colors flex items-center gap-1">
                                        <Globe size={12} /> {m.url}
                                    </a>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">100%</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Uptime 24h</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                <span>24 hours ago</span>
                                <span>Present</span>
                            </div>
                            <UptimeBar history={demoData?.uptimeHistory || []} />
                        </div>
                    </div>
                )) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-xl tracking-tight">Main API Gate</h3>
                                    <p className="text-slate-400 text-sm">https://api.pulsetrace.com/health</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">99.9%</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Demo Status</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                <span>24 hours ago</span>
                                <span>Present</span>
                            </div>
                            <UptimeBar history={demoData?.uptimeHistory || []} />
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Add New Monitor</h3>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Display Name</label>
                                <input
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={name} onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Production API" required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target URL</label>
                                <input
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={url} onChange={e => setUrl(e.target.value)}
                                    placeholder="https://api.example.com/health" type="url" required
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold px-4 py-2">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-900/40 hover:bg-indigo-500 transition-all active:scale-95">Create Monitor</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
