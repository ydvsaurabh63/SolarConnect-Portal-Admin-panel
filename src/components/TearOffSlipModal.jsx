import React from 'react';
import { X, Printer, ShieldCheck, Sun } from 'lucide-react';

export default function TearOffSlipModal({ application, onClose }) {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const regDate = new Date(application.createdAt || application.issuedOn || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-card print-slip-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Top actions */}
        <div className="slip-modal-top-bar no-print">
          <span className="smt-title">Official Acknowledgement Receipt</span>
          <div className="smt-actions">
            <button type="button" className="slip-print-btn" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print Slip</span>
            </button>
            <button type="button" className="mdc-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div id="printable-admin-slip" className="printable-tear-slip">
          {/* Header */}
          <div className="pts-header">
            <div className="pts-brand">
              <Sun size={28} className="text-emerald" />
              <div>
                <h2>PM Surya Ghar: Muft Bijli Yojana</h2>
                <span>SolarConnect Digital Rooftop Survey Portal</span>
              </div>
            </div>

            <div className="pts-reg-box font-mono">
              <span className="pts-reg-lbl">REGISTRATION ID</span>
              <strong className="pts-reg-val">{application.registrationId}</strong>
            </div>
          </div>

          <div className="pts-title-bar">
            <span>आवेदक पावती रसीद / APPLICANT ACKNOWLEDGEMENT RECEIPT</span>
          </div>

          {/* Details 2-Column Grid */}
          <div className="pts-details-grid">
            <div className="pts-item">
              <span className="pts-lbl">Applicant Name:</span>
              <strong className="pts-val">{application.fullName}</strong>
            </div>

            <div className="pts-item">
              <span className="pts-lbl">Mobile Number:</span>
              <strong className="pts-val">{application.mobile}</strong>
            </div>

            <div className="pts-item">
              <span className="pts-lbl">Electricity Consumer No:</span>
              <strong className="pts-val font-mono">{application.consumerNo}</strong>
            </div>

            <div className="pts-item">
              <span className="pts-lbl">Monthly Electricity Bill:</span>
              <strong className="pts-val">₹{Number(application.avgMonthlyBill || 0).toLocaleString('en-IN')}</strong>
            </div>

            <div className="pts-item">
              <span className="pts-lbl">District / City:</span>
              <strong className="pts-val">{application.districtCity}</strong>
            </div>

            <div className="pts-item">
              <span className="pts-lbl">Submission Channel:</span>
              <strong className="pts-val">{application.submissionMode === 'FIELD_EXECUTIVE' ? 'Field Agent Visit' : 'Self Applicant'}</strong>
            </div>

            <div className="pts-item">
              <span className="pts-lbl">Registration Date:</span>
              <strong className="pts-val">{regDate}</strong>
            </div>

            <div className="pts-item">
              <span className="pts-lbl">Verification Status:</span>
              <strong className="pts-val text-emerald">{application.verification?.status || 'Pending'}</strong>
            </div>
          </div>

          {/* Verification Remarks */}
          {application.verification?.remarks && (
            <div className="pts-remarks-box">
              <span className="pts-lbl">Office Remarks:</span>
              <p className="pts-val">{application.verification.remarks}</p>
            </div>
          )}

          {/* Bottom Signatures */}
          <div className="pts-signatures">
            <div className="pts-sig-col">
              <div className="sig-line"></div>
              <span>Applicant Signature / आवेदक हस्ताक्षर</span>
            </div>

            <div className="pts-sig-col">
              <div className="sig-line"></div>
              <span>Authorized Officer Seal / हस्ताक्षर एवं मुहर</span>
            </div>
          </div>

          <div className="pts-footer-note">
            <ShieldCheck size={14} className="text-emerald" />
            <span>This is an official system-generated registration receipt under PM Surya Ghar Yojana. Retain for net meter verification.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
