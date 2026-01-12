import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, Monitor, Globe, Shield, Terminal } from 'lucide-react';

export const IssueDetails = () => {
    const { id } = useParams();

    // Mock data for a specific issue
    const issue = {
        id,
        title: 'Uncaught TypeError: Cannot read property "id" of undefined',
        type: 'Exception',
        lastSeen: '2 minutes ago',
        firstSeen: 'Jan 12, 11:20 PM',
        environment: 'production',
        release: 'v1.2.4',
        exception: {
            type: 'TypeError',
            value: 'Cannot read property "id" of undefined',
            stacktrace: `at getUserProfile (auth.ts:42:10)
at ProfilePage (Profile.tsx:18:2)
at renderWithHooks (react-dom.development.js:16305:18)
at mountIndeterminateComponent (react-dom.development.js:20074:13)
at beginWork (react-dom.development.js:21587:16)`
        },
        breadcrumbs: [
            { type: 'navigation', message: '/settings', timestamp: '11:21:40 PM' },
            { type: 'click', message: 'button.save-profile', timestamp: '11:21:42 PM' },
            { type: 'console', message: 'Saving profile...', level: 'info', timestamp: '11:21:42 PM' },
            { type: 'error', message: 'Uncaught TypeError...', level: 'error', timestamp: '11:21:43 PM' },
        ]
    };

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
                            Last seen {issue.lastSeen}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    {/* Stacktrace */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                            <Terminal size={16} className="text-indigo-400" />
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Stacktrace</h3>
                        </div>
                        <div className="p-6">
                            <pre className="text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
                                {issue.exception.stacktrace.split('\n').map((line, i) => (
                                    <div key={i} className="hover:bg-slate-800/50 px-2 rounded -mx-2">
                                        <span className="text-slate-600 mr-4 select-none">{i + 1}</span>
                                        {line}
                                    </div>
                                ))}
                            </pre>
                        </div>
                    </section>

                    {/* Breadcrumbs */}
                    <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                            <Activity size={16} className="text-indigo-400" />
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Breadcrumbs</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {issue.breadcrumbs.map((crumb, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${crumb.level === 'error' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-700'}`}></div>
                                        {i !== issue.breadcrumbs.length - 1 && <div className="w-[1px] flex-1 bg-slate-800 my-1"></div>}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="text-sm text-slate-300 font-medium">{crumb.message}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{crumb.type}</span>
                                            <span className="text-[10px] text-slate-600 font-mono">{crumb.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
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
                                    <p className="text-sm text-slate-200">{issue.environment}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-slate-500" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Release</p>
                                    <p className="text-sm text-slate-200">{issue.release}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Monitor size={18} className="text-slate-500" />
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">First Seen</p>
                                    <p className="text-sm text-slate-200">{issue.firstSeen}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Help types/imports for sub-components
import { Activity } from 'lucide-react';
