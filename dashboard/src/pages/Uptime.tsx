import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

export const Uptime = () => {
    const { user } = useAuth();
    const [monitors, setMonitors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Modal State
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const fetchMonitors = () => {
        // For MVP we need to know WHICH project context we are in.
        // If the user navigates from "Projects > Settings", they are in a project.
        // If they click "Uptime" in sidebar, we might need to pick a default project or show ALL.
        // Let's assume we list monitors for the FIRST project found for now, or require project selection.
        // BETTER: Fetch a list of user's projects first? 
        // SIMPLIFICATION: We will fetch /api/projects first, then pick the first one to show monitors for.

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
        const interval = setInterval(fetchMonitors, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Fetch projects again to get ID (hacky, should utilize context)
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
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Uptime Monitors</h2>
                    <p className="text-slate-400 mt-1">Status checks for your endpoints</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Monitor
                </button>
            </div>

            <div className="grid gap-4">
                {monitors.map((m: any) => (
                    <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${m.status === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {m.status === 'up' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{m.name}</h3>
                                <a href={m.url} target="_blank" className="text-slate-400 text-sm hover:underline">{m.url}</a>
                            </div>
                        </div>

                        <div className="text-right space-y-1">
                            <div className="flex items-center gap-2 justify-end text-slate-300">
                                <Clock size={14} />
                                <span className="text-sm font-mono">{m.lastCheck ? new Date(m.lastCheck).toLocaleTimeString() : 'Pending'}</span>
                            </div>
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                                {m.status}
                            </span>
                        </div>
                    </div>
                ))}

                {monitors.length === 0 && !loading && (
                    <div className="text-center py-12 text-slate-500">
                        No monitors configured. Add one to start tracking.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Add New Monitor</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                                <input
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                                    value={name} onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Landing Page" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">URL</label>
                                <input
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                                    value={url} onChange={e => setUrl(e.target.value)}
                                    placeholder="https://example.com" type="url" required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white px-4 py-2">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
