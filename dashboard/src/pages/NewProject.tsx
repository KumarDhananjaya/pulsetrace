import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Code, Layers, Loader2 } from 'lucide-react';

export const NewProject = () => {
    const [name, setName] = useState('');
    const [platform, setPlatform] = useState('web');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3001/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ name, platform })
            });

            if (!res.ok) throw new Error('Failed to create project');

            const project = await res.json();
            navigate(`/settings/projects/${project.id}`);
        } catch (err) {
            setError('Could not create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Box className="text-indigo-500" />
                Create New Project
            </h1>

            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Project Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. E-Commerce Frontend"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Platform</label>
                    <div className="grid grid-cols-3 gap-4">
                        {['web', 'node', 'react-native'].map(p => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => setPlatform(p)}
                                className={`flex items-center justify-center gap-2 p-4 rounded-lg border transition-all ${platform === p
                                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                    }`}
                            >
                                {p === 'web' && <Layers size={18} />}
                                {p === 'node' && <Code size={18} />}
                                <span className="capitalize">{p}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-rose-500 text-sm">{error}</p>}

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    );
};
