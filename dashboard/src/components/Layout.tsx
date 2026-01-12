import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, Activity, Settings, BarChart3 } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
            ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-[#0a0c10] text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800/50 p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white italic">
                        P
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">PulseTrace</h1>
                </div>

                <nav className="flex flex-col gap-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview"
                        to="/"
                        active={location.pathname === '/'}
                    />
                    <SidebarItem
                        icon={AlertCircle}
                        label="Issues"
                        to="/issues"
                        active={location.pathname.startsWith('/issues')}
                    />
                    <SidebarItem
                        icon={BarChart3}
                        label="Performance"
                        to="/performance"
                        active={location.pathname === '/performance'}
                    />
                    <SidebarItem
                        icon={Activity}
                        label="Real-time"
                        to="/realtime"
                        active={location.pathname === '/realtime'}
                    />
                </nav>

                <div className="mt-auto">
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        to="/settings"
                        active={location.pathname === '/settings'}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-7xl mx-auto italic">
                    {children}
                </div>
            </main>
        </div>
    );
};
