import { Activity, Zap, Layers, MousePointer2, TrendingUp, Monitor, Smartphone, Globe } from 'lucide-react';
import { useDemoData } from '../hooks/useDemoData';

const ScoreCard = ({ title, value, rating, unit, icon: Icon, description, trend }: any) => {
    const getColor = (r: string) => {
        if (r === 'good') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        if (r === 'needs-improvement') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start relative z-10">
                <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 group-hover:text-white transition-colors">
                    <Icon size={24} />
                </div>
                {rating && (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getColor(rating)}`}>
                        {rating.replace('-', ' ')}
                    </span>
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest">{title}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                        {value !== undefined ? (typeof value === 'number' ? value.toFixed(value < 1 ? 2 : 0) : value) : '-'}
                    </span>
                    <span className="text-sm font-medium text-slate-500">{unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-500">
                    <TrendingUp size={14} />
                    {trend} vs last 7d
                </div>
            </div>
        </div>
    );
};

const MiniChart = ({ data, color }: { data: any[], color: string }) => {
    if (!data || data.length === 0) return null;
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.value - min) / range) * 80 - 10;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="w-full h-32 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            />
        </svg>
    );
};

export const Performance = () => {
    const data = useDemoData(true);

    const getRating = (metric: string, val: number) => {
        if (metric === 'LCP') return val < 2500 ? 'good' : val < 4000 ? 'needs-improvement' : 'poor';
        if (metric === 'INP') return val < 200 ? 'good' : val < 500 ? 'needs-improvement' : 'poor';
        if (metric === 'CLS') return val < 0.1 ? 'good' : val < 0.25 ? 'needs-improvement' : 'poor';
        return 'good';
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Vitals Explorer</h2>
                    <p className="text-slate-400 mt-2 text-lg">Real-world performance data across your user base.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-white hover:bg-slate-800 transition-all">24 Hours</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/20">7 Days</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScoreCard
                    title="Largest Contentful Paint"
                    value={data?.lcp[data.lcp.length - 1].value}
                    rating={getRating('LCP', data?.lcp[data.lcp.length - 1].value || 0)}
                    unit="ms"
                    icon={Zap}
                    trend="-12%"
                />
                <ScoreCard
                    title="Interaction to Next Paint"
                    value={data?.inp[data.inp.length - 1].value}
                    rating={getRating('INP', data?.inp[data.inp.length - 1].value || 0)}
                    unit="ms"
                    icon={MousePointer2}
                    trend="-4%"
                />
                <ScoreCard
                    title="Cumulative Layout Shift"
                    value={data?.cls[data.cls.length - 1].value}
                    rating={getRating('CLS', data?.cls[data.cls.length - 1].value || 0)}
                    unit=""
                    icon={Layers}
                    trend="+0.01"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">LCP Trend (P75)</h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            Global Avg
                        </div>
                    </div>
                    <div className="h-48 flex items-end">
                        <MiniChart data={data?.lcp || []} color="#6366f1" />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Device Breakdown</h3>
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Desktop', val: '64%', icon: Monitor, color: 'bg-indigo-500' },
                            { label: 'Mobile', val: '28%', icon: Smartphone, color: 'bg-emerald-500' },
                            { label: 'Tablet', val: '8%', icon: Globe, color: 'bg-amber-500' },
                        ].map((d, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <div className="flex items-center gap-2 text-white">
                                        <d.icon size={14} className="text-slate-500" />
                                        {d.label}
                                    </div>
                                    <span className="text-slate-400">{d.val}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${d.color} rounded-full`} style={{ width: d.val }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
