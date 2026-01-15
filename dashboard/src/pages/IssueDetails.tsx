import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, Monitor, Globe, Shield, Terminal, Activity, Loader2 } from 'lucide-react';

interface Breadcrumb {
    type: string;
    message?: string;
    category?: string;
    level?: string;
    timestamp: number;
}

interface IssueDetail {
    id: string;
    title: string;
    type: string;
    lastSeen: string;
    firstSeen: string;
    events: {
        id: string;
        timestamp: string;
        exception?: {
            type: string;
            value: string;
            stacktrace?: string;
        };
        breadcrumbs?: Breadcrumb[];
        environment?: string;
        release?: string;
        contexts?: any;
    }[];
}

export const IssueDetails = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState<IssueDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:3001/api/issues/${id}`)
            .then(async res => {
                if (!res.ok) throw new Error('Failed to fetch issue details');
                return res.json();
            })
            .then((data) => {
                setIssue(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Could not load issue details.');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
            </div>
        );
    }

    if (error || !issue || !issue.events[0]) {
        return (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg">
                {error || 'Issue not found or has no events.'}
                <br />
                <Link to="/issues" className="text-sm underline mt-2 inline-block">Back to Issues</Link>
            </div>
        );
    }

    const latestEvent = issue.events[0];
    const breadcrumbs = latestEvent.breadcrumbs || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link to="/issues" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-white break-all">{issue.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                            {issue.type}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Last seen {new Date(issue.lastSeen).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                            <Monitor size={12} />
                            First seen {new Date(issue.firstSeen).toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    {/* Stacktrace */}
                    {latestEvent.exception?.stacktrace && (
                        <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                                <Terminal size={16} className="text-indigo-400" />
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Stacktrace</h3>
                            </div>
                            <div className="p-6">
                                <pre className="text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
                                    {latestEvent.exception.stacktrace.split('\n').map((line, i) => (
                                        <div key={i} className="hover:bg-slate-800/50 px-2 rounded -mx-2 whitespace-pre-wrap break-all">
                                            <span className="text-slate-600 mr-4 select-none inline-block w-6 text-right">{i + 1}</span>
                                            {line}
                                        </div>
                                    ))}
                                </pre>
                            </div>
                        </section>
                    )}

                    {/* Breadcrumbs */}
                    {breadcrumbs.length > 0 && (
                        <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                                <Activity size={16} className="text-indigo-400" />
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Breadcrumbs</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {breadcrumbs.map((crumb, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${crumb.level === 'error' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-700'}`}></div>
                                            {i !== breadcrumbs.length - 1 && <div className="w-[1px] flex-1 bg-slate-800 my-1"></div>}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-sm text-slate-300 font-medium">{crumb.message || crumb.category || 'Event'}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{crumb.type}</span>
                                                <span className="text-[10px] text-slate-600 font-mono">{new Date(crumb.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-4 space-y-6">
                    {/* Metadata Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Context</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Shield size={18} className="text-slate-500" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Environment</p>
                                    <p className="text-sm text-slate-200">{latestEvent.environment || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-slate-500" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Release</p>
                                    <p className="text-sm text-slate-200">{latestEvent.release || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Monitor size={18} className="text-slate-500" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">OS / Browser</p>
                                    <p className="text-sm text-slate-200">
                                        {latestEvent.contexts?.os?.name} {latestEvent.contexts?.os?.version}
                                        {' / '}
                                        {latestEvent.contexts?.browser?.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
