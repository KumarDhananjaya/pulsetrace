import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, AlertCircle, Activity, Settings, BarChart3, Database, LogOut, BookOpen } from 'lucide-react';

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

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;
        fetch('http://localhost:3001/api/projects', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProjects(data);
            })
            .catch(console.error);
    }, [user]);

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

                <div className="flex flex-col gap-4">
                    <div className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                        <span>Projects</span>
                        <Link to="/app/projects/new" className="hover:text-white text-slate-400 text-lg leading-none">+</Link>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {projects.map(p => (
                            <Link
                                key={p.id}
                                to={`/app/settings/projects/${p.id}`}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${location.pathname.includes(p.id)
                                    ? 'bg-slate-800 text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span className="truncate">{p.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="w-full h-[1px] bg-slate-800/50"></div>

                <nav className="flex flex-col gap-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview"
                        to="/app"
                        active={location.pathname === '/app' || location.pathname === '/app/'}
                    />
                    <SidebarItem
                        icon={AlertCircle}
                        label="Issues"
                        to="/app/issues"
                        active={location.pathname.startsWith('/app/issues')}
                    />
                    <SidebarItem
                        icon={BarChart3}
                        label="Performance"
                        to="/app/performance"
                        active={location.pathname === '/app/performance'}
                    />
                    <SidebarItem
                        icon={Activity}
                        label="Uptime"
                        to="/app/uptime"
                        active={location.pathname === '/app/uptime'}
                    />
                    <SidebarItem
                        icon={Database}
                        label="Logs"
                        to="/app/logs"
                        active={location.pathname === '/app/logs'}
                    />
                    <SidebarItem
                        icon={Activity}
                        label="Real-time"
                        to="/app/realtime"
                        active={location.pathname === '/app/realtime'}
                    />
                    <SidebarItem
                        icon={BookOpen}
                        label="Documentation"
                        to="/docs/quickstart"
                        active={location.pathname.startsWith('/docs')}
                    />
                </nav>

                <div className="mt-auto space-y-4">
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        to="/app/settings"
                        active={location.pathname === '/app/settings'}
                    />

                    {/* User Profile & Logout */}
                    <div className="pt-4 border-t border-slate-800/50">
                        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                                    {user?.name?.slice(0, 2) || 'PT'}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-white truncate">{user?.name}</span>
                                    <span className="text-[10px] text-slate-500 truncate lowercase">{user?.email}</span>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                                title="Log Out"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
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
