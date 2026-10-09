import React, { useState } from 'react';
import { Users, Search, Trash2, Shield, User, RefreshCw, Mail, Phone, Calendar } from 'lucide-react';

export default function UsersManagement({ users = [], onDeleteUser, onRefresh, loading }) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.mobile?.includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="users-management-page animate-fade-in">
      <div className="dash-header-row">
        <div>
          <h1 className="dash-page-title">Field Staff & Registered Users</h1>
          <p className="dash-page-sub">
            Manage authorized field executives, survey agents, and portal accounts.
          </p>
        </div>

        <div className="dash-header-actions">
          <button
            type="button"
            className="dash-action-btn secondary"
            onClick={onRefresh}
            title="Refresh Users"
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            <span>Sync Staff</span>
          </button>
        </div>
      </div>

      <div className="table-controls-card">
        <div className="table-secondary-filters">
          <div className="table-search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search user by name, email, mobile, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-count-label">
            Total Staff & Users: <strong>{filteredUsers.length}</strong>
          </div>
        </div>
      </div>

      <div className="table-responsive-container">
        {loading ? (
          <div className="table-loading-state">
            <RefreshCw size={28} className="spinning text-emerald" />
            <p>Loading user accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="table-empty-state">
            <Users size={42} className="text-muted" />
            <h3>No Users Found</h3>
            <p>Users registered on the public website or survey app will appear here.</p>
          </div>
        ) : (
          <table className="master-data-table">
            <thead>
              <tr>
                <th>User / Staff Member</th>
                <th>Contact Info</th>
                <th>Assigned Role</th>
                <th>Executive ID</th>
                <th>Registration Date</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id || user.email}>
                  <td>
                    <div className="candidate-cell">
                      <strong className="cand-name">{user.fullName || 'Unnamed User'}</strong>
                      <span className="cand-email text-muted">{user.email}</span>
                    </div>
                  </td>

                  <td>
                    <div className="contact-cell">
                      <span>{user.mobile || '—'}</span>
                    </div>
                  </td>

                  <td>
                    <span className={`role-pill ${user.role === 'admin' ? 'admin' : 'executive'}`}>
                      {user.role === 'admin' ? 'System Admin' : 'Field Executive'}
                    </span>
                  </td>

                  <td>
                    <span className="font-mono text-dark">{user.executiveId || 'EX-OFFICE'}</span>
                  </td>

                  <td>
                    <span className="cell-date">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons-cell">
                      <button
                        type="button"
                        className="row-action-btn delete"
                        onClick={() => onDeleteUser(user._id, user.fullName || user.email)}
                        title="Remove User"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
