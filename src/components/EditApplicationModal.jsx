import React, { useState } from 'react';
import { X, Save, User, Phone, MapPin, Zap, Building } from 'lucide-react';

export default function EditApplicationModal({ application, onClose, onSave }) {
  if (!application) return null;

  const [formData, setFormData] = useState({
    fullName: application.fullName || '',
    mobile: application.mobile || '',
    alternateNo: application.alternateNo || '',
    email: application.email || '',
    address: application.address || '',
    districtCity: application.districtCity || '',
    pinCode: application.pinCode || '',
    consumerNo: application.consumerNo || '',
    avgMonthlyBill: application.avgMonthlyBill || '',
    propertyType: application.propertyType || 'Residential',
    rooftopArea: application.rooftopArea || '',
    roofType: application.roofType || 'RCC',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(application.registrationId || application._id, formData);
    setSaving(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="mdc-header">
          <div className="mdc-title-group">
            <span className="mdc-badge-pill">EDIT APPLICATION DATA</span>
            <h2>Edit: <span className="text-emerald font-mono">{application.registrationId}</span></h2>
          </div>
          <button type="button" className="mdc-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mdc-body edit-form-body">
          <div className="mdc-section-card">
            <h3 className="section-title">
              <User size={16} className="text-emerald" />
              <span>Candidate Details</span>
            </h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Mobile *</label>
                <input
                  type="tel"
                  name="mobile"
                  className="form-input"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alternate Contact</label>
                <input
                  type="tel"
                  name="alternateNo"
                  className="form-input"
                  value={formData.alternateNo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group span-2">
                <label className="form-label">Complete Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">District / City *</label>
                <input
                  type="text"
                  name="districtCity"
                  className="form-input"
                  value={formData.districtCity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PIN Code *</label>
                <input
                  type="text"
                  name="pinCode"
                  className="form-input"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mdc-section-card">
            <h3 className="section-title">
              <Zap size={16} className="text-solar" />
              <span>Electricity & Rooftop Specs</span>
            </h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Electricity Consumer No *</label>
                <input
                  type="text"
                  name="consumerNo"
                  className="form-input font-mono"
                  value={formData.consumerNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Average Monthly Bill (₹) *</label>
                <input
                  type="number"
                  name="avgMonthlyBill"
                  className="form-input"
                  value={formData.avgMonthlyBill}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rooftop Area (sq. ft.)</label>
                <input
                  type="number"
                  name="rooftopArea"
                  className="form-input"
                  value={formData.rooftopArea}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Structure / Roof Type</label>
                <select
                  name="roofType"
                  className="form-select"
                  value={formData.roofType}
                  onChange={handleChange}
                >
                  <option value="RCC">RCC Concrete Roof</option>
                  <option value="Tin Shed">Tin / Metal Shed</option>
                  <option value="Tiled">Tiled Roof</option>
                  <option value="Other">Other Structure</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mdc-footer-actions">
            <button type="button" className="dash-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="dash-btn-save" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
