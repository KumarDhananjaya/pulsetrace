import { Activity, Zap, Layers, MousePointer2 } from 'lucide-react';


const ScoreCard = ({ title, value, rating, unit, icon: Icon, description }: any) => {
    const getColor = (r: string) => {
        if (r === 'good') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        if (r === 'needs-improvement') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                    <Icon size={20} />
                </div>
                {rating && (
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getColor(rating)}`}>
                        {rating.replace('-', ' ')}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-white">
                        {value ? (value).toFixed(2) : '-'}
                    </span>
                    <span className="text-sm text-slate-500">{unit}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">{description}</p>
            </div>
        </div>
    );
};

export const Performance = () => {
    // In a real app, we would fetch aggregated stats (avg, p75) from the API.
    // For this MVP, we might need a new endpoint or just list recent events.
    // Let's create a placeholder view that explains what would be here or fetches raw events if easy.


    return (
        <div className="space-y-8 animate-in fade-in">
            <div>
                <h2 className="text-3xl font-bold text-white">Performance</h2>
                <p className="text-slate-400 mt-2">Real User Monitoring (Core Web Vitals)</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <ScoreCard
                    title="Largest Contentful Paint (LCP)"
                    value={1200}
                    rating="good"
                    unit="ms"
                    icon={Zap}
                    description="Loading performance. Should be under 2.5s."
                />
                <ScoreCard
                    title="Interaction to Next Paint (INP)"
                    value={150}
                    rating="needs-improvement"
                    unit="ms"
                    icon={MousePointer2}
                    description="Interactivity. Should be under 200ms."
                />
                <ScoreCard
                    title="Cumulative Layout Shift (CLS)"
                    value={0.05}
                    rating="good"
                    unit=""
                    icon={Layers}
                    description="Visual stability. Should be less than 0.1."
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-slate-800 mb-2">
                    <Activity size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Waiting for Vitals...</h3>
                <p className="text-slate-400 max-w-lg mx-auto">
                    The PulseTrace SDK is configured to capture Core Web Vitals automatically.
                    Once your users interact with your app, real-world performance data will appear here.
                </p>
            </div>
        </div>
    );
};
