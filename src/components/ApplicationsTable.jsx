import React, { useState } from 'react';
import { 
  Search, Filter, Download, Eye, Edit3, Trash2, Printer, 
  CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw, FileText
} from 'lucide-react';

export default function ApplicationsTable({
  applications = [],
  statusFilter,
  setStatusFilter,
  modeFilter,
  setModeFilter,
  searchQuery,
  setSearchQuery,
  onViewApplication,
  onEditApplication,
  onDeleteApplication,
  onPrintSlip,
  onQuickStatusChange,
  loading,
}) {
  // Filter locally if searchQuery or modeFilter applied
  const filteredList = applications.filter((app) => {
    // Status filter
    const status = app.verificationStatus || app.raw?.verification?.status || 'Pending';
    if (statusFilter !== 'ALL' && status !== statusFilter) {
      return false;
    }

    // Mode filter
    if (modeFilter !== 'ALL' && app.submissionMode !== modeFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        app.registrationId?.toLowerCase().includes(q) ||
        (app.applicantName || app.fullName)?.toLowerCase().includes(q) ||
        app.mobile?.includes(q) ||
        app.consumerNo?.toLowerCase().includes(q) ||
        app.districtCity?.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredList.length === 0) return;

    const headers = [
      'Registration ID',
      'Applicant Name',
      'Mobile',
      'District/City',
      'Consumer No',
      'Monthly Bill',
      'Submission Mode',
      'Executive Name',
      'Verification Status',
      'Submitted On',
    ];

    const rows = filteredList.map((a) => [
      a.registrationId,
      `"${a.applicantName || a.fullName || ''}"`,
      a.mobile,
      `"${a.districtCity || ''}"`,
      a.consumerNo,
      a.avgMonthlyBill || 0,
      a.submissionMode,
      `"${a.executiveName || ''}"`,
      a.verificationStatus || a.raw?.verification?.status || 'Pending',
      a.sentOn || a.raw?.createdAt || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SolarConnect_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="applications-management-page animate-fade-in">
      {/* Top Header */}
      <div className="dash-header-row">
        <div>
          <h1 className="dash-page-title">Candidate Registrations</h1>
          <p className="dash-page-sub">
            Complete database of digital survey booklets submitted for PM Surya Ghar: Muft Bijli Yojana.
          </p>
        </div>

        <div className="dash-header-actions">
          <button
            type="button"
            className="dash-action-btn secondary"
            onClick={handleExportCSV}
            title="Download records as CSV Excel sheet"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="table-controls-card">
        {/* Status Filter Tabs */}
        <div className="status-tabs-row">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'Pending', label: 'Pending Review' },
            { id: 'Verified', label: 'Verified' },
            { id: 'Approved', label: 'Approved' },
            { id: 'Rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`status-tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.id === 'Pending' && (
                <span className="tab-badge amber">
                  {applications.filter(a => (a.verificationStatus || a.raw?.verification?.status) === 'Pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Search & Mode */}
        <div className="table-secondary-filters">
          <div className="table-search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search candidate name, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-select-group">
            <span className="fsg-label">Channel:</span>
            <select
              className="filter-select"
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
            >
              <option value="ALL">All Submission Channels</option>
              <option value="SELF_APPLICANT">Direct Self-Applicant</option>
              <option value="FIELD_EXECUTIVE">Field Executive Visit</option>
            </select>
          </div>

          <div className="table-count-label">
            Showing <strong>{filteredList.length}</strong> of {applications.length}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="table-responsive-container">
        {loading && applications.length === 0 ? (
          <div className="table-loading-state">
            <RefreshCw size={28} className="spinning text-emerald" />
            <p>Syncing database records...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="table-empty-state">
            <FileText size={42} className="text-muted" />
            <h3>No Matching Applications</h3>
            <p>Try clearing your search query or switching your status filter.</p>
          </div>
        ) : (
          <table className="master-data-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Candidate & Contact</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((app) => {
                const raw = app.raw || app;
                const status = app.verificationStatus || raw.verification?.status || 'Pending';

                return (
                  <tr key={app._id || app.registrationId}>
                    {/* 1. Registration ID */}
                    <td>
                      <div className="reg-id-cell">
                        <span className="font-mono font-bold text-dark">{app.registrationId}</span>
                        <span className="cell-date">
                          {new Date(app.sentOn || raw.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* 2. Candidate & Contact */}
                    <td>
                      <div className="candidate-cell">
                        <strong className="cand-name">{app.applicantName || raw.fullName}</strong>
                        <span className="cand-phone">{app.mobile}</span>
                      </div>
                    </td>

                    {/* 3. Status Dropdown */}
                    <td>
                      <select
                        className={`status-select ${status.toLowerCase()}`}
                        value={status}
                        onChange={(e) => onQuickStatusChange(app.registrationId || app._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* 4. Action */}
                    <td>
                      <div className="action-buttons-cell">
                        {/* View / Inspect Full Details */}
                        <button
                          type="button"
                          className="row-action-btn view"
                          onClick={() => onViewApplication(raw)}
                          title="View Full Information & Survey Docs"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Edit Record */}
                        <button
                          type="button"
                          className="row-action-btn edit"
                          onClick={() => onEditApplication(raw)}
                          title="Edit Application Data"
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* Print Slip */}
                        <button
                          type="button"
                          className="row-action-btn print"
                          onClick={() => onPrintSlip(raw)}
                          title="View / Print Official Slip"
                        >
                          <Printer size={15} />
                        </button>

                        {/* Delete Record */}
                        <button
                          type="button"
                          className="row-action-btn delete"
                          onClick={() => onDeleteApplication(app.registrationId || app._id, app.applicantName || raw.fullName)}
                          title="Delete Application"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
