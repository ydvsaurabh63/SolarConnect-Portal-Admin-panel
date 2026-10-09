import React, { useState } from 'react';
import { 
  X, CheckCircle2, AlertCircle, FileText, User, Phone, 
  MapPin, Zap, Shield, IndianRupee, Camera, Calendar, CheckSquare, Square
} from 'lucide-react';

export default function ApplicationDetailModal({ application, onClose, onSaveVerification }) {
  if (!application) return null;

  const currentStatus = application.verification?.status || 'Pending';
  const [status, setStatus] = useState(currentStatus);
  const [remarks, setRemarks] = useState(application.verification?.remarks || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSaveVerification(application.registrationId || application._id, status, remarks);
    setSaving(false);
  };

  const docs = application.documents || {};
  const docList = [
    { label: 'Aadhaar Card (आधार कार्ड)', ok: docs.aadhaarCard?.collected },
    { label: 'PAN Card (पैन कार्ड)', ok: docs.panCard?.collected },
    { label: 'Electricity Bill (नवीनतम बिजली बिल)', ok: docs.bijliBill?.collected },
    { label: 'Bank Passbook / Cheque (बैंक पासबुक)', ok: docs.bankPassbook?.collected },
    { label: 'Land / House Tax Receipt (जमीन/मकान रसीद)', ok: docs.jaminRasid?.collected },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mdc-header">
          <div className="mdc-title-group">
            <span className="mdc-badge-pill">OFFICIAL SURVEY RECORD</span>
            <h2>Application: <span className="text-emerald font-mono">{application.registrationId}</span></h2>
            <span className="mdc-date">
              Submitted on: {new Date(application.createdAt || application.issuedOn || Date.now()).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <button type="button" className="mdc-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="mdc-body">
          {/* Section 1: Candidate KYC & Contact */}
          <div className="mdc-section-card">
            <h3 className="section-title">
              <User size={16} className="text-emerald" />
              <span>Candidate Details (आवेदक का विवरण)</span>
            </h3>

            <div className="mdc-grid-3">
              <div className="info-field">
                <span className="info-lbl">Full Name</span>
                <strong className="info-val">{application.fullName}</strong>
              </div>

              <div className="info-field">
                <span className="info-lbl">Primary Mobile</span>
                <strong className="info-val">{application.mobile}</strong>
              </div>

              <div className="info-field">
                <span className="info-lbl">Alternate Contact</span>
                <span className="info-val">{application.alternateNo || '—'}</span>
              </div>

              <div className="info-field">
                <span className="info-lbl">Email Address</span>
                <span className="info-val">{application.email || '—'}</span>
              </div>

              <div className="info-field span-2">
                <span className="info-lbl">Full Address</span>
                <span className="info-val">{application.address}</span>
              </div>

              <div className="info-field">
                <span className="info-lbl">District / City</span>
                <strong className="info-val">{application.districtCity}</strong>
              </div>

              <div className="info-field">
                <span className="info-lbl">PIN Code</span>
                <strong className="info-val">{application.pinCode}</strong>
              </div>

              <div className="info-field">
                <span className="info-lbl">Submission Channel</span>
                <span className={`mode-badge ${application.submissionMode === 'FIELD_EXECUTIVE' ? 'agent' : 'self'}`}>
                  {application.submissionMode === 'FIELD_EXECUTIVE' ? 'Field Agent Assisted' : 'Citizen Self-Applicant'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Electricity & Rooftop Capacity */}
          <div className="mdc-section-card">
            <h3 className="section-title">
              <Zap size={16} className="text-solar" />
              <span>Electricity & Rooftop Survey (बिजली व छत विवरण)</span>
            </h3>

            <div className="mdc-grid-3">
              <div className="info-field">
                <span className="info-lbl">Electricity Consumer No</span>
                <strong className="info-val font-mono">{application.consumerNo}</strong>
              </div>

              <div className="info-field">
                <span className="info-lbl">Average Monthly Bill</span>
                <strong className="info-val text-emerald">
                  ₹{Number(application.avgMonthlyBill || 0).toLocaleString('en-IN')} / month
                </strong>
              </div>

              <div className="info-field">
                <span className="info-lbl">Connection Holder</span>
                <span className="info-val">{application.connectionName || 'Self'}</span>
              </div>

              <div className="info-field">
                <span className="info-lbl">Property Ownership</span>
                <span className="info-val">{application.ownership || 'Owned'}</span>
              </div>

              <div className="info-field">
                <span className="info-lbl">Rooftop Area</span>
                <span className="info-val">{application.rooftopArea || 0} sq. ft.</span>
              </div>

              <div className="info-field">
                <span className="info-lbl">Roof Structure Type</span>
                <span className="info-val">{application.roofType || 'RCC Concrete'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Document Checklist & Geotagged Rooftop Photo */}
          <div className="mdc-section-card">
            <h3 className="section-title">
              <Camera size={16} className="text-emerald" />
              <span>Survey KYC & Geotagged Rooftop Photo (दस्तावेज़ एवं फ़ोटो)</span>
            </h3>

            <div className="docs-and-photo-split">
              {/* Docs Checklist */}
              <div className="checklist-subbox">
                <span className="subbox-title">Document Checklist</span>
                <ul className="doc-checklist-view">
                  {docList.map((d, i) => (
                    <li key={i} className={`dcl-item ${d.ok ? 'checked' : 'missing'}`}>
                      {d.ok ? <CheckCircle2 size={16} className="text-emerald" /> : <AlertCircle size={16} className="text-muted" />}
                      <span>{d.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* GPS Rooftop Survey Status */}
              <div className="gps-photo-subbox">
                <span className="subbox-title">Rooftop Survey Photo</span>
                {docs.rooftopGpsPhoto?.previewUrl ? (
                  <div className="gps-img-preview-box">
                    <img 
                      src={docs.rooftopGpsPhoto.previewUrl} 
                      alt="Rooftop Survey Photo" 
                      className="gps-preview-img"
                    />
                    <div className="gps-overlay-info">
                      <span>📍 Lat: {docs.rooftopGpsPhoto.gpsLatitude || '26.9124° N'}</span>
                      <span>📍 Lng: {docs.rooftopGpsPhoto.gpsLongitude || '75.7873° E'}</span>
                    </div>
                  </div>
                ) : docs.rooftopGpsPhoto?.collected ? (
                  <div className="gps-placeholder-badge collected">
                    <CheckCircle2 size={24} className="text-emerald" />
                    <strong>Geotagged Survey Photo Captured</strong>
                    <span>Lat: {docs.rooftopGpsPhoto.gpsLatitude || '26.9124° N'} | Long: {docs.rooftopGpsPhoto.gpsLongitude || '75.7873° E'}</span>
                  </div>
                ) : (
                  <div className="gps-placeholder-badge missing">
                    <Camera size={24} className="text-muted" />
                    <span>No rooftop photo uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Office Verification & Approval Controls */}
          <div className="mdc-section-card verification-box">
            <h3 className="section-title">
              <Shield size={16} className="text-emerald" />
              <span>Office Verification & Decision (कार्यालय सत्यापन एवं निर्णय)</span>
            </h3>

            <form onSubmit={handleSave} className="verification-form">
              <div className="vf-row">
                <div className="form-group">
                  <label className="form-label">Update Verification Status</label>
                  <select 
                    className="form-select status-select-big"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending Review (लंबित)</option>
                    <option value="Verified">Verified Documents (दस्तावेज़ सत्यापित)</option>
                    <option value="Approved">Approved for Discom Installation (स्वीकृत)</option>
                    <option value="Rejected">Rejected / Incomplete (अस्वीकृत)</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Office Verification Remarks</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Documents verified. Eligible for 3 kW subsidy..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="vf-submit-btn"
                  disabled={saving}
                >
                  <CheckCircle2 size={16} />
                  <span>{saving ? 'Saving...' : 'Save Decision'}</span>
                </button>
              </div>

              {application.verification?.verifiedAt && (
                <div className="vf-history">
                  <span>Last decision recorded on: {new Date(application.verification.verifiedAt).toLocaleString('en-IN')} by {application.verification.verifiedBy || 'Admin Officer'}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
