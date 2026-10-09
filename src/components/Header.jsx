import React from 'react';
import { Search, RefreshCw, Bell, User, Shield, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onRefresh, 
  loading, 
  pendingCount = 0 
}) {
  return (
    <header className="admin-header">
      <div className="header-left">
        <div className="header-search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Applicant Name, Reg ID, Mobile, or Consumer No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Refresh button */}
        <button 
          type="button" 
          className={`header-action-btn ${loading ? 'spinning' : ''}`}
          onClick={onRefresh}
          title="Refresh All Records"
        >
          <RefreshCw size={16} />
          <span>Sync Data</span>
        </button>

        {/* Notifications badge */}
        <div className="header-noti-badge" title={`${pendingCount} pending applications`}>
          <Bell size={18} />
          {pendingCount > 0 && <span className="noti-bubble">{pendingCount}</span>}
        </div>

        {/* User profile */}
        <div className="header-user-badge">
          <div className="hub-avatar">
            <User size={16} />
          </div>
          <div className="hub-info">
            <span className="hub-name">Central Officer</span>
            <span className="hub-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
