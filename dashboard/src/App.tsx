import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { IssuesList } from './pages/IssuesList';
import { IssueDetails } from './pages/IssueDetails';

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

const Performance = () => <h2 className="text-3xl font-bold text-white italic">Performance Metrics</h2>;
const Realtime = () => <h2 className="text-3xl font-bold text-white italic">Real-time Feed</h2>;
const Settings = () => <h2 className="text-3xl font-bold text-white italic">Settings</h2>;

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/issues" element={<IssuesList />} />
                    <Route path="/issues/:id" element={<IssueDetails />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/realtime" element={<Realtime />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
