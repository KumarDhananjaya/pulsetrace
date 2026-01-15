import { Link, useLocation, Outlet } from 'react-router-dom';
import { BookOpen, Zap, Code, Shield, Layers, ChevronRight, Search, Terminal } from 'lucide-react';

const DocsSidebarItem = ({ label, to, active }: { label: string, to: string, active: boolean }) => (
    <Link
        to={to}
        className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all ${active
            ? 'bg-indigo-600/10 text-indigo-400 font-medium'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
    >
        <span>{label}</span>
        {active && <ChevronRight size={14} />}
    </Link>
);

export const DocsLayout = () => {
    const location = useLocation();

    const sections = [
        {
            title: 'Getting Started',
            icon: Zap,
            items: [
                { label: 'Quickstart', to: '/docs/quickstart' },
                { label: 'Architecture', to: '/docs/architecture' },
            ]
        },
        {
            title: 'SDK Guides',
            icon: Code,
            items: [
                { label: 'Web Integration', to: '/docs/sdk-web' },
                { label: 'React Native', to: '/docs/sdk-mobile' },
                { label: 'Node.js', to: '/docs/sdk-node' },
            ]
        },
        {
            title: 'API Reference',
            icon: Terminal,
            items: [
                { label: 'Ingestion API', to: '/docs/api-ingestion' },
                { label: 'Identity API', to: '/docs/api-identity' },
            ]
        }
    ];

    return (
        <div className="flex min-h-screen bg-[#0a0c10] text-slate-200">
            {/* Docs Sidebar */}
            <aside className="w-72 border-r border-slate-800/50 flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-xs font-bold text-white italic group-hover:scale-110 transition-transform">
                            P
                        </div>
                        <span className="font-bold text-white tracking-tight">PulseTrace Docs</span>
                    </Link>
                </div>

                <div className="p-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="px-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                <section.icon size={12} />
                                <span>{section.title}</span>
                            </div>
                            <div className="space-y-1">
                                {section.items.map((item, i) => (
                                    <DocsSidebarItem
                                        key={i}
                                        label={item.label}
                                        to={item.to}
                                        active={location.pathname === item.to}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-800/50">
                    <Link
                        to="/app"
                        className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 ml-72 overflow-y-auto bg-[#0a0c10]">
                <div className="max-w-4xl mx-auto px-12 py-16">
                    <div className="prose prose-invert prose-slate max-w-none">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
