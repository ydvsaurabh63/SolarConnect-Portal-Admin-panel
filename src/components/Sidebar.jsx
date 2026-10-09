import React from 'react';
import { 
  Sun, LayoutDashboard, FileText, Users, ExternalLink, 
  Database, ShieldCheck, RefreshCw, Activity
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, appCount, dbStatus, onRefresh }) {
  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <img 
          src="/solarconnect-logo-dark.png" 
          alt="SolarConnect" 
          className="admin-sidebar-logo" 
        />
        <span className="brand-role-tag">ADMIN CONTROL</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">MAIN MENU</div>

        <button
          type="button"
          className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard Overview</span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <FileText size={18} />
          <span className="link-title-flex">
            <span>Solar Applications</span>
            {appCount > 0 && <span className="nav-counter">{appCount}</span>}
          </span>
        </button>

        <button
          type="button"
          className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>Field Staff & Users</span>
        </button>

        <div className="nav-group-label" style={{ marginTop: '1.5rem' }}>EXTERNAL ACCESS</div>

        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link portal-redirect-link"
        >
          <ExternalLink size={18} />
          <span>Open Public Website</span>
        </a>
      </nav>

      {/* Footer System Status */}
      <div className="sidebar-footer">
        <div className="system-status-card">
          <div className="ssc-header">
            <span className="ssc-dot"></span>
            <span className="ssc-title">Backend Status</span>
            <button 
              type="button" 
              className="ssc-refresh-btn" 
              onClick={onRefresh} 
              title="Refresh Data"
            >
              <RefreshCw size={13} />
            </button>
          </div>
          <span className="ssc-detail">
            {dbStatus || 'Connected (Port 4000)'}
          </span>
        </div>
      </div>
    </aside>
  );
}
