import { Activity, Zap } from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

export const Realtime = () => {
    const data = useDemoData(true);

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Real-time Feed</h2>
                    <p className="text-slate-400 mt-1">Live stream of incoming global events</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
                        <Zap size={20} className="text-amber-400 animate-pulse" />
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Throughput</p>
                            <p className="text-xl font-bold text-white leading-none mt-1">{data?.throughput || 0} ev/s</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-slate-950 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col relative group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(99,102,241,0.05)_0%,_transparent_50%)]"></div>

                <div className="flex-1 overflow-auto p-8 space-y-3 custom-scrollbar relative z-10">
                    {data?.recentLogs.map((log) => (
                        <div key={log.id} className="flex items-center gap-4 group/row animate-in slide-in-from-right-4 duration-500">
                            <span className="text-slate-600 font-mono text-xs w-20">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <div className="h-[20px] w-[2px] bg-indigo-500/20 group-hover/row:bg-indigo-500/50 transition-colors"></div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 min-w-[50px] text-center">
                                {log.level}
                            </span>
                            <span className="text-slate-500 font-medium text-xs">[{log.source}]</span>
                            <span className="text-slate-200 text-sm font-medium">{log.message}</span>
                            <div className="flex-1 border-b border-white/5 border-dashed"></div>
                            <Activity size={12} className="text-slate-700" />
                        </div>
                    ))}
                    {!data && (
                        <div className="h-full flex items-center justify-center text-slate-500 animate-pulse">
                            Establishing secure WebSocket connection...
                        </div>
                    )}
                </div>

                <div className="shrink-0 h-2 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"></div>
            </div>
        </div>
    );
};
