import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, Loader2 } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

interface Issue {
    id: string;
    title: string;
    type: string;
    status: string;
    lastSeen: string;
    events: number;
    users?: number; // Backend might not send this yet if not optimized
}

export const IssuesList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        +
            fetch('http://localhost:3001/api/issues', {
                credentials: 'include'
            })
                .then(async res => {
                    if (!res.ok) throw new Error('Failed to fetch issues');
                    return res.json();
                })
                .then((data) => {
                    setIssues(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError('Could not load issues. Is the API running?');
                    setLoading(false);
                });
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg">
                {error}
            </div>
        );
    }

    if (issues.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                <h3 className="text-xl font-medium text-slate-300">No Issues Detected</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Great news! Your application hasn't reported any errors.
                    <br />
                    Or maybe you haven't integrated the <code className="text-indigo-400">@pulsetrace/sdk</code> yet?
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white">Issues</h2>
                    <p className="text-slate-400 mt-2">Aggregated errors and exceptions from your projects.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white">
                        <option>All Projects</option>
                    </select>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-1 border-none"></div>
                    <div className="col-span-9 border-none">Issue</div>
                    <div className="col-span-2 border-none text-right">Events</div>
                </div>

                <div className="divide-y divide-slate-800">
                    {issues.map((issue) => (
                        <div
                            key={issue.id}
                            onClick={() => navigate(`/issues/${issue.id}`)}
                            className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-800/30 transition-colors cursor-pointer group items-center"
                        >
                            <div className="col-span-1 border-none flex items-start pt-1">
                                <AlertCircle className={`w-5 h-5 ${issue.status === 'unresolved' ? 'text-rose-500' : 'text-emerald-500'}`} />
                            </div>
                            <div className="col-span-9 border-none space-y-1">
                                <div className="flex items-baseline gap-3">
                                    <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors truncate max-w-[80%]">
                                        {issue.title}
                                    </h3>
                                    <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-slate-700">
                                        {issue.type}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(issue.lastSeen).toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        Fingerprint: <code className="bg-slate-800/50 px-1 rounded text-slate-400">{issue.id.substring(0, 8)}</code>
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-2 border-none text-right flex flex-col justify-center">
                                <span className="text-white font-medium">{issue.events}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
