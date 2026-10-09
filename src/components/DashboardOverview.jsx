import React from 'react';
import { 
  FileText, Clock, CheckCircle2, Zap, IndianRupee, 
  MapPin, UserCheck, ShieldCheck, ArrowRight, Eye, AlertCircle
} from 'lucide-react';

export default function DashboardOverview({ 
  applications = [], 
  onViewApplication, 
  onGoToApplications,
  onFilterPending 
}) {
  // Aggregate stats
  const total = applications.length;
  const pending = applications.filter(a => (a.verificationStatus || a.raw?.verification?.status) === 'Pending').length;
  const verified = applications.filter(a => {
    const s = a.verificationStatus || a.raw?.verification?.status;
    return s === 'Verified' || s === 'Done' || s === 'Approved';
  }).length;
  const rejected = applications.filter(a => (a.verificationStatus || a.raw?.verification?.status) === 'Rejected').length;

  // Total kW capacity estimated from bills
  const totalKw = applications.reduce((acc, curr) => {
    const bill = curr.avgMonthlyBill || curr.raw?.avgMonthlyBill || 0;
    const units = bill / 7.5;
    const kw = Math.max(1, Math.round((units / 120) * 10) / 10);
    return acc + kw;
  }, 0);

  // Total estimated subsidy pipeline
  const totalSubsidyLakhs = applications.reduce((acc, curr) => {
    const bill = curr.avgMonthlyBill || curr.raw?.avgMonthlyBill || 0;
    const units = bill / 7.5;
    const kw = Math.max(1, Math.round((units / 120) * 10) / 10);
    let sub = 78000;
    if (kw <= 1.2) sub = 30000;
    else if (kw <= 2.2) sub = 60000;
    return acc + (sub / 100000);
  }, 0);

  // Mode breakdown
  const selfCount = applications.filter(a => a.submissionMode === 'SELF_APPLICANT').length;
  const agentCount = applications.filter(a => a.submissionMode === 'FIELD_EXECUTIVE').length;

  // Top 5 recent applications
  const recentList = applications.slice(0, 5);

  return (
    <div className="dashboard-overview-page animate-fade-in">
      {/* Page Title */}
      <div className="dash-header-row">
        <div>
          <h1 className="dash-page-title">Executive Control Overview</h1>
          <p className="dash-page-sub">
            Real-time management dashboard for PM Surya Ghar registrations, site surveys, and office approvals.
          </p>
        </div>
        <div className="dash-header-actions">
          <button 
            type="button" 
            className="dash-action-btn primary"
            onClick={onGoToApplications}
          >
            <span>View All Applications</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="dash-kpi-grid">
        {/* Card 1: Total */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap blue">
            <FileText size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Total Applications</span>
            <span className="kpi-val">{total}</span>
            <span className="kpi-trend positive">100% Digital Booklet Log</span>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="kpi-card clickable" onClick={onFilterPending}>
          <div className="kpi-icon-wrap amber">
            <Clock size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Pending Verification</span>
            <span className="kpi-val">{pending}</span>
            <span className="kpi-trend warning">Action Required</span>
          </div>
        </div>

        {/* Card 3: Approved */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap green">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Verified & Approved</span>
            <span className="kpi-val">{verified}</span>
            <span className="kpi-trend positive">
              {total > 0 ? Math.round((verified / total) * 100) : 0}% Clearance Rate
            </span>
          </div>
        </div>

        {/* Card 4: Subsidy Pipeline */}
        <div className="kpi-card">
          <div className="kpi-icon-wrap emerald">
            <IndianRupee size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Subsidy Pipeline</span>
            <span className="kpi-val">₹{totalSubsidyLakhs.toFixed(2)} L</span>
            <span className="kpi-trend positive">{totalKw.toFixed(1)} kW Capacity</span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Recent Submissions & Submission Breakdown */}
      <div className="dash-two-cols">
        {/* Left: Recent Submissions Table */}
        <div className="dash-box">
          <div className="dash-box-header">
            <div className="dbh-title-group">
              <h3>Recent Incoming Applications</h3>
              <span className="dbh-subtitle">Latest candidate survey booklets awaiting processing</span>
            </div>
            <button 
              type="button" 
              className="dash-link-btn" 
              onClick={onGoToApplications}
            >
              See All ({total})
            </button>
          </div>

          {recentList.length === 0 ? (
            <div className="dash-empty-state">
              <FileText size={36} className="text-muted" />
              <p>No applications submitted yet.</p>
              <span>Applications submitted on the public website will show up here in real time.</span>
            </div>
          ) : (
            <div className="dash-mini-table-wrap">
              <table className="dash-mini-table">
                <thead>
                  <tr>
                    <th>Reg ID</th>
                    <th>Applicant</th>
                    <th>District</th>
                    <th>Monthly Bill</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentList.map((app) => {
                    const status = app.verificationStatus || app.raw?.verification?.status || 'Pending';
                    return (
                      <tr key={app._id || app.registrationId}>
                        <td>
                          <span className="reg-id-badge font-mono">{app.registrationId}</span>
                        </td>
                        <td>
                          <div className="applicant-cell">
                            <strong>{app.applicantName || app.fullName}</strong>
                            <span>{app.mobile}</span>
                          </div>
                        </td>
                        <td>{app.districtCity || '—'}</td>
                        <td>₹{Number(app.avgMonthlyBill || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`mode-pill ${app.submissionMode === 'FIELD_EXECUTIVE' ? 'agent' : 'self'}`}>
                            {app.submissionMode === 'FIELD_EXECUTIVE' ? 'Field Agent' : 'Self Online'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${status.toLowerCase()}`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="dash-btn-icon"
                            onClick={() => onViewApplication(app.raw || app)}
                            title="Inspect Details"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Breakdown & Highlights */}
        <div className="dash-box">
          <div className="dash-box-header">
            <div className="dbh-title-group">
              <h3>Submission Channels</h3>
              <span className="dbh-subtitle">Online citizen self-applications vs Field agent door visits</span>
            </div>
          </div>

          <div className="channel-breakdown-cards">
            <div className="channel-card self">
              <div className="cc-header">
                <span className="cc-title">Self-Applicant (Option 1)</span>
                <span className="cc-count">{selfCount}</span>
              </div>
              <p className="cc-desc">Direct citizens registering rooftop solar plant on the portal.</p>
              <div className="cc-progress-bar">
                <div 
                  className="cc-bar-fill self" 
                  style={{ width: `${total > 0 ? (selfCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="channel-card agent">
              <div className="cc-header">
                <span className="cc-title">Field Agent Visits (Option 2)</span>
                <span className="cc-count">{agentCount}</span>
              </div>
              <p className="cc-desc">Assisted door-to-door registrations by registered executives.</p>
              <div className="cc-progress-bar">
                <div 
                  className="cc-bar-fill agent" 
                  style={{ width: `${total > 0 ? (agentCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="scheme-kpi-banner">
            <div className="skb-icon">
              <ShieldCheck size={24} className="text-emerald" />
            </div>
            <div className="skb-text">
              <strong>PM Surya Ghar Muft Bijli Compliance</strong>
              <p>Applications automatically check Aadhaar, Bijli Bill, and Bank Passbook records for Direct Benefit Transfer (DBT).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
