import { AlertCircle, Clock } from 'lucide-react';

// Temporary mock data for UI development
const MOCK_ISSUES = [
    {
        id: '1',
        title: 'Uncaught TypeError: Cannot read property "id" of undefined',
        type: 'Exception',
        status: 'unresolved',
        lastSeen: '2 minutes ago',
        events: 420,
        users: 85,
    },
    {
        id: '2',
        title: 'NetworkError: Failed to fetch API resource',
        type: 'Error',
        status: 'unresolved',
        lastSeen: '15 minutes ago',
        events: 124,
        users: 12,
    },
    {
        id: '3',
        title: 'ReferenceError: localStorage is not defined',
        type: 'Exception',
        status: 'resolved',
        lastSeen: '2 hours ago',
        events: 8,
        users: 3,
    }
];

export const IssuesList = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white">Issues</h2>
                    <p className="text-slate-400 mt-2">Aggregated errors and exceptions from your projects.</p>
                </div>
                <div className="flex gap-3">
                    <select className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>All Projects</option>
                    </select>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-1 border-none"></div>
                    <div className="col-span-7 border-none">Issue</div>
                    <div className="col-span-2 border-none text-right">Events</div>
                    <div className="col-span-2 border-none text-right">Users</div>
                </div>

                <div className="divide-y divide-slate-800">
                    {MOCK_ISSUES.map((issue) => (
                        <div
                            key={issue.id}
                            className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-800/30 transition-colors cursor-pointer group"
                        >
                            <div className="col-span-1 border-none flex items-start pt-1">
                                <AlertCircle className={`w-5 h-5 ${issue.status === 'unresolved' ? 'text-rose-500' : 'text-emerald-500'}`} />
                            </div>
                            <div className="col-span-7 border-none space-y-1">
                                <h3 className="text-white font-medium group-hover:text-indigo-400 transition-colors truncate">
                                    {issue.title}
                                </h3>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {issue.lastSeen}
                                    </span>
                                    <span className="bg-slate-800 px-2 py-0.5 rounded uppercase font-bold tracking-tighter text-[10px]">
                                        {issue.type}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-2 border-none text-right flex flex-col justify-center">
                                <span className="text-white font-medium">{issue.events}</span>
                                <span className="text-[10px] text-slate-500 uppercase">total</span>
                            </div>
                            <div className="col-span-2 border-none text-right flex flex-col justify-center">
                                <span className="text-white font-medium">{issue.users}</span>
                                <span className="text-[10px] text-slate-500 uppercase">unique</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
