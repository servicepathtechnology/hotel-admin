import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Hotel, CalendarCheck, Settings, 
  Activity, AlertTriangle, CheckCircle, Clock, Search
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'bookings', label: 'Bookings', icon: <CalendarCheck size={20} /> },
    { id: 'rooms', label: 'Rooms & Inventory', icon: <Hotel size={20} /> },
    { id: 'users', label: 'Guest Directory', icon: <Users size={20} /> },
    { id: 'operations', label: 'AI Operations', icon: <Activity size={20} /> }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Hotel className="text-blue-500" /> CRM Admin
      </div>
      <nav className="sidebar-nav">
        {tabs.map(tab => (
          <div 
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </div>
        ))}
      </nav>
    </div>
  );
};

const DashboardOverview = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch('https://hotel-backend-coral.vercel.app/api/admin/metrics')
      .then(r => r.json())
      .then(setMetrics)
      .catch(console.error);
  }, []);

  if (!metrics) return <div className="p-4">Loading stats...</div>;

  return (
    <div className="dashboard-content">
      <h2 className="mb-6 text-2xl">Property Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-100"><BarChart3 className="text-blue-600"/></div>
          <div className="stat-info">
            <p>Gross Booking Value</p>
            <h3>₹{metrics.total_revenue}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green-100"><Hotel className="text-green-600"/></div>
          <div className="stat-info">
            <p>Avg Occupancy Rate</p>
            <h3>{metrics.occupancy_rate}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-purple-100"><CalendarCheck className="text-purple-600"/></div>
          <div className="stat-info">
            <p>Active Bookings Today</p>
            <h3>{metrics.active_bookings}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow-100"><Users className="text-yellow-600"/></div>
          <div className="stat-info">
            <p>New CRM Leads</p>
            <h3>{metrics.total_leads}</h3>
          </div>
        </div>
      </div>

      <div className="panel mt-8">
        <div className="panel-header">
            <h3>Quick System Status</h3>
        </div>
        <div className="panel-body flex gap-6">
            <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="flex items-center gap-2 text-green-700 font-bold mb-2"><CheckCircle size={18}/> Core Booking Engine</h4>
                <p className="text-sm text-green-600">Operating normally. Latency 42ms.</p>
            </div>
            <div className="flex-1 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="flex items-center gap-2 text-blue-700 font-bold mb-2"><Activity size={18}/> Operations AI Model</h4>
                <p className="text-sm text-blue-600">Model synced 2 hours ago. Predictive routing enabled.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('https://hotel-backend-coral.vercel.app/api/bookings/')
      .then(r => r.json())
      .then(setBookings)
      .catch(console.error);
  }, []);

  return (
    <div className="dashboard-content">
      <h2 className="mb-6 text-2xl">All Reservations</h2>
      
      <div className="panel">
        <div className="panel-header">
           <div className="relative search-wrapper">
               <Search size={18} className="absolute left-3 top-3 text-gray-400" />
               <input type="text" placeholder="Search booking ID or guest..." className="pl-10 p-2 border rounded-md" />
           </div>
        </div>
        <table className="crm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest ID</th>
              <th>Room ID</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td className="font-medium">#{b.id}</td>
                <td>{String(b.user_id).substring(0, 8)}...</td>
                <td>Room {b.room_id}</td>
                <td className="text-sm">{b.check_in} — {b.check_out}</td>
                <td><span className={`status-badge ${(b.status||'').toLowerCase()}`}>{b.status}</span></td>
                <td className="font-bold">₹{b.total_price}</td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan="6" className="text-center py-6 text-gray-500">No bookings found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RoomInventory = () => {
    const [rooms, setRooms] = useState([]);
  
    useEffect(() => {
      fetch('https://hotel-backend-coral.vercel.app/api/admin/rooms/status')
        .then(r => r.json())
        .then(setRooms)
        .catch(console.error);
    }, []);
  
    return (
      <div className="dashboard-content">
        <h2 className="mb-6 text-2xl">Room Inventory & Status</h2>
        
        <div className="panel">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Type</th>
                <th>Nightly Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.id}>
                  <td className="font-medium">{r.id}</td>
                  <td>{r.type}</td>
                  <td>₹{r.price}</td>
                  <td>
                    {r.is_booked ? (
                        <span className="status-badge pending flex items-center gap-1 w-max"><Clock size={14}/> Occupied / Booked</span>
                    ) : (
                        <span className="status-badge available flex items-center gap-1 w-max"><CheckCircle size={14}/> Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

const UserDirectory = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      fetch('https://hotel-backend-coral.vercel.app/api/admin/users')
        .then(r => r.json())
        .then(setUsers)
        .catch(console.error);
    }, []);
  
    return (
      <div className="dashboard-content">
        <h2 className="mb-6 text-2xl">Guest & User Directory</h2>
        
        <div className="panel">
          <table className="crm-table">
            <thead>
              <tr>
                <th>System ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="text-xs text-gray-500">{u.id}</td>
                  <td className="font-medium">{u.name || 'Anonymous User'}</td>
                  <td>{u.email}</td>
                  <td><span className={`status-badge ${u.role === 'admin' ? 'confirmed' : 'available'}`}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

const AIOperations = () => {
    const [ops, setOps] = useState(null);
  
    useEffect(() => {
      fetch('https://hotel-backend-coral.vercel.app/api/admin/ai-operations')
        .then(r => r.json())
        .then(setOps)
        .catch(console.error);
    }, []);
    
    if(!ops) return <div className="p-8 text-center text-gray-500 font-medium">Loading Real-Time AI Models...</div>;

    return (
      <div className="dashboard-content p-8 bg-gray-50">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <Activity className="text-blue-600 w-8 h-8"/> 
                    Intelligence Hub
                </h2>
                <p className="text-gray-500 mt-2 text-sm">Predictive routing and algorithmic management engine.</p>
            </div>
            <div className="text-sm border border-green-200 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Optimized
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Housekeeping Predictions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-gray-100">
                    <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-blue-600"/> Smart Housekeeping
                    </h4>
                </div>
                <div className="p-5 space-y-4">
                    {ops.housekeeping.map((h, i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-gray-900 text-lg">Room {h.room_id}</span>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                                    h.priority === 'High' ? 'bg-red-100 text-red-700' : 
                                    h.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                }`}>{h.priority}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">{h.reason}</p>
                            <div className="flex justify-between items-center text-xs font-semibold text-gray-500 border-t border-gray-200 pt-3">
                                <span className="flex items-center gap-1"><Clock size={14}/> {h.time_predicted}</span>
                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md">Assign: {h.assignee}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Predictive Maintenance */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 border-b border-gray-100">
                    <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="text-red-500"/> Predictive Maintenance
                    </h4>
                </div>
                <div className="p-5 space-y-4">
                    {ops.maintenance.map((m, i) => (
                        <div key={i} className="p-4 rounded-xl border border-red-100 bg-red-50/30">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-gray-900">{m.equipment}</span>
                                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-md">{m.status}</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed mb-5">{m.prediction}</p>
                            
                            <div className="w-full bg-red-100 rounded-full h-2 mb-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{width: m.probability}}></div>
                            </div>
                            <div className="text-right text-xs font-bold text-red-600 tracking-wide">{m.probability} Failure Probability</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Staff Scheduling Pipeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 border-b border-gray-100">
                    <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Users className="text-green-600"/> Automated Roster
                    </h4>
                </div>
                <div className="p-5">
                    <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <strong className="block mb-2 text-indigo-800 text-sm">Market Context</strong>
                        <p className="text-indigo-900 text-sm leading-relaxed">{ops.staffing.prediction}</p>
                    </div>
                    
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                         <strong className="block mb-2 text-gray-800 text-sm">Action Plan</strong>
                         <p className="text-sm text-gray-600 leading-relaxed">{ops.staffing.recommendation}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-green-100 border border-green-200 rounded-xl p-4 text-center">
                            <span className="block text-xs text-green-800 uppercase tracking-widest font-bold mb-1">Speed Gain</span>
                            <span className="text-xl font-black text-green-700">{ops.staffing.efficiency_gain}</span>
                        </div>
                        <div className="bg-blue-100 border border-blue-200 rounded-xl p-4 text-center">
                            <span className="block text-xs text-blue-800 uppercase tracking-widest font-bold mb-1">Savings</span>
                            <span className="text-xl font-black text-blue-700">{ops.staffing.cost_savings}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
};


function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content">
        <header className="topbar">
            <div className="topbar-title">Central CRM Portal</div>
            <div className="topbar-actions">
                <span className="text-sm text-gray-500 font-medium">Logged in as Administrator</span>
                <div className="avatar">AD</div>
            </div>
        </header>
        
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'bookings' && <BookingsList />}
        {activeTab === 'rooms' && <RoomInventory />}
        {activeTab === 'users' && <UserDirectory />}
        {activeTab === 'operations' && <AIOperations />}
      </div>
    </div>
  );
}

export default App;
