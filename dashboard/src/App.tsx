import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { IssuesList } from './pages/IssuesList';
import { IssueDetails } from './pages/IssueDetails';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NewProject } from './pages/NewProject';
import { ProjectSettings } from './pages/ProjectSettings';
import { Performance } from './pages/Performance';
import { Uptime } from './pages/Uptime';
import { Logs } from './pages/Logs';
import { Landing } from './pages/Landing';
import { Features } from './pages/Features';
import { Pricing } from './pages/Pricing';
import { Solutions } from './pages/Solutions';
import { DocsLayout } from './components/DocsLayout';
import { Quickstart } from './pages/docs/Quickstart';
import { SDKIntegration } from './pages/docs/SDKIntegration';
import { Architecture } from './pages/docs/Architecture';

// Placeholder components for other pages
const Overview = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Project Overview</h2>
        <div className="grid grid-cols-4 gap-6">
            {[
                { label: 'Total Events', value: '12.4k', change: '+12%', trend: 'up' },
                { label: 'Unresolved Issues', value: '24', change: '-2', trend: 'down' },
                { label: 'Avg LCP', value: '1.2s', change: 'Good', trend: 'neutral' },
                { label: 'Uptime', value: '99.9%', change: 'Stable', trend: 'neutral' },
            ].map((stat, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className={`text-xs ${stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'down' ? 'text-rose-500' : 'text-slate-500'}`}>
                        {stat.change}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

const Realtime = () => <h2 className="text-3xl font-bold text-white italic">Real-time Feed</h2>;
const Settings = () => <h2 className="text-3xl font-bold text-white italic">Settings</h2>;
const DocsPlaceholder = ({ title }: { title: string }) => (
    <div className="animate-in fade-in duration-700">
        <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">{title}</h1>
        <p className="text-xl text-slate-400 leading-relaxed">This section is currently being updated with the latest PulseTrace specifications.</p>
    </div>
);

function RequireAuth({ children }: { children: JSX.Element }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/solutions" element={<Solutions />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Authenticated Dashboard Routes */}
                    <Route path="/app/*" element={
                        <RequireAuth>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Overview />} />
                                    <Route path="/issues" element={<IssuesList />} />
                                    <Route path="/issues/:id" element={<IssueDetails />} />
                                    <Route path="/projects/new" element={<NewProject />} />
                                    <Route path="/settings/projects/:id" element={<ProjectSettings />} />
                                    <Route path="/performance" element={<Performance />} />
                                    <Route path="/uptime" element={<Uptime />} />
                                    <Route path="/logs" element={<Logs />} />
                                    <Route path="/realtime" element={<Realtime />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="*" element={<Navigate to="/app" replace />} />
                                </Routes>
                            </Layout>
                        </RequireAuth>
                    } />
                    {/* Documentation Routes */}
                    <Route path="/docs" element={<DocsLayout />}>
                        <Route index element={<Navigate to="/docs/quickstart" replace />} />
                        <Route path="quickstart" element={<Quickstart />} />
                        <Route path="sdk-web" element={<SDKIntegration />} />
                        <Route path="sdk-mobile" element={<DocsPlaceholder title="React Native SDK" />} />
                        <Route path="sdk-node" element={<DocsPlaceholder title="Node.js SDK" />} />
                        <Route path="api-ingestion" element={<DocsPlaceholder title="Ingestion API" />} />
                        <Route path="api-identity" element={<DocsPlaceholder title="Identity API" />} />
                        <Route path="architecture" element={<Architecture />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
