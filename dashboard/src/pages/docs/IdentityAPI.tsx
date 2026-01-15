import { Lock, Key, Users } from 'lucide-react';

export const IdentityAPI = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
                <Lock size={18} />
                <span>API Reference</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Identity API</h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12">
                Manage users, sessions, and OAuth providers programmatically using our Identity Service endpoints.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <Key size={18} className="text-amber-400" />
                        Session Management
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        PulseTrace uses HTTP-only Secure cookies combined with JWT rotation. Access tokens are short-lived, while refresh tokens are stored in an encrypted session database.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <Users size={18} className="text-indigo-400" />
                        Multi-tenancy
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        All users are associated with Workspaces. Identities from Google and GitHub can be linked to a single PulseTrace account seamlessly.
                    </p>
                </div>
            </div>

            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Core Endpoints</h2>

                <div className="space-y-4">
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded uppercase">GET</span>
                            <code className="text-sm font-bold text-white">/auth/me</code>
                        </div>
                        <span className="text-xs text-slate-500">Returns current session & user metadata</span>
                    </div>

                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded uppercase">POST</span>
                            <code className="text-sm font-bold text-white">/auth/logout</code>
                        </div>
                        <span className="text-xs text-slate-500">Revokes current refresh token</span>
                    </div>

                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded uppercase">POST</span>
                            <code className="text-sm font-bold text-white">/auth/refresh</code>
                        </div>
                        <span className="text-xs text-slate-500">Manual token rotation trigger</span>
                    </div>
                </div>
            </section>
        </div>
    );
};
