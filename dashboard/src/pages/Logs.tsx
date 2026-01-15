import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Database, Clock, ChevronRight } from 'lucide-react';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'debug': return 'text-slate-500 border-slate-500/20 bg-slate-500/10';
        case 'info': return 'text-sky-500 border-sky-500/20 bg-sky-500/10';
        case 'warn': return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
        case 'error': return 'text-rose-500 border-rose-500/20 bg-rose-500/10';
        case 'fatal': return 'text-purple-500 border-purple-500/20 bg-purple-500/10';
        default: return 'text-slate-400 border-slate-400/20 bg-slate-400/10';
    }
};

export const Logs = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState('');
    const [search, setSearch] = useState('');
    const [projectId, setProjectId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchLogs = async () => {
        if (!token) return;

        try {
            // First get projects if we don't have a projectId
            let currentProjectId = projectId;
            if (!currentProjectId) {
                const projects = await fetch('http://localhost:3001/api/projects', {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => res.json());

                if (projects.length > 0) {
                    currentProjectId = projects[0].id;
                    setProjectId(currentProjectId);
                } else {
                    setLoading(false);
                    return;
                }
            }

            const query = new URLSearchParams();
            if (level) query.append('level', level);
            if (search) query.append('search', search);

            const data = await fetch(`http://localhost:3001/api/logs/projects/${currentProjectId}/logs?${query.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json());

            setLogs(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, [token, level, search, projectId]);

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-white">Log Explorer</h2>
                    <p className="text-slate-400 mt-1">Search and filter application logs</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">All Levels</option>
                        {LOG_LEVELS.map(l => (
                            <option key={l} value={l}>{l.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto font-mono text-sm p-4 space-y-1 custom-scrollbar" ref={scrollRef}>
                    {logs.map((log) => (
                        <div key={log.id} className="group flex items-start gap-4 hover:bg-white/5 p-1 rounded transition-colors border-l-2 border-transparent">
                            <span className="text-slate-600 shrink-0 select-none">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getLevelColor(log.level)} shrink-0 min-w-[60px] text-center`}>
                                {log.level}
                            </span>
                            <span className="text-slate-400 shrink-0 font-semibold select-none group-hover:text-slate-300">
                                [{log.source || 'default'}]
                            </span>
                            <span className="text-slate-300 break-all">
                                {log.message}
                            </span>
                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                                <button className="ml-auto text-slate-600 hover:text-indigo-400 transition-colors">
                                    <ChevronRight size={14} />
                                </button>
                            )}
                        </div>
                    ))}

                    {logs.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                            <Database size={48} />
                            <p>No logs found matching your criteria</p>
                        </div>
                    )}
                </div>

                <div className="shrink-0 bg-slate-900/50 border-t border-slate-800 px-4 py-2 flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Streaming active
                        </span>
                        <span>Showing {logs.length} logs</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
