import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ApplicationsTable from './components/ApplicationsTable';
import UsersManagement from './components/UsersManagement';
import ApplicationDetailModal from './components/ApplicationDetailModal';
import EditApplicationModal from './components/EditApplicationModal';
import TearOffSlipModal from './components/TearOffSlipModal';
import { adminApi } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'applications' | 'users'
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, done: 0, docsComplete: 0 });
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');

  // Modals
  const [activeDetailApp, setActiveDetailApp] = useState(null);
  const [activeEditApp, setActiveEditApp] = useState(null);
  const [activePrintApp, setActivePrintApp] = useState(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null); // { type: 'app'|'user', id, name }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch all backend data (silent background sync by default)
  const loadData = async (isManual = false) => {
    if (isManual) {
      setIsSyncing(true);
    }
    try {
      // 1. Health
      const health = await adminApi.getHealth();
      setDbStatus(health.database || (health.status === 'ok' ? 'Online' : 'Offline'));

      // 2. Applications / Submission Log
      const appRes = await adminApi.getApplications();
      if (appRes && appRes.success) {
        setApplications(appRes.submissionLog || []);
      }

      // 3. Stats
      const statRes = await adminApi.getStats();
      if (statRes && statRes.success) {
        setStats(statRes.stats);
      }

      // 4. Users
      const userRes = await adminApi.getUsers();
      if (userRes && userRes.success) {
        setUsers(userRes.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      if (isManual) {
        showToast('Could not reach backend server. Check if backend is running on port 4000.');
      }
    } finally {
      setIsInitialLoad(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => loadData(false), 5000); // Silent background poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Quick Status Dropdown Handler
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await adminApi.updateVerification(id, newStatus, `Status updated to ${newStatus} from table.`);
      if (res.success) {
        showToast(`Updated status for ${id} to ${newStatus}`);
        loadData();
      }
    } catch (err) {
      showToast('Failed to update status');
    }
  };

  // Detailed Modal Status Save
  const handleSaveVerification = async (id, status, remarks) => {
    try {
      const res = await adminApi.updateVerification(id, status, remarks, 'Super Admin');
      if (res.success) {
        showToast(`Verification saved for ${id}`);
        setActiveDetailApp(null);
        loadData();
      }
    } catch (err) {
      showToast('Failed to save verification decision');
    }
  };

  // Edit Application Save
  const handleSaveEdit = async (id, updates) => {
    try {
      const res = await adminApi.updateApplication(id, updates);
      if (res.success) {
        showToast(`Application ${id} updated successfully`);
        setActiveEditApp(null);
        loadData();
      }
    } catch (err) {
      showToast('Failed to update application');
    }
  };

  // Delete Application Confirmation & Action
  const triggerDeleteApp = (id, name) => {
    setDeleteConfirmTarget({ type: 'app', id, name });
  };

  const triggerDeleteUser = (id, name) => {
    setDeleteConfirmTarget({ type: 'user', id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmTarget) return;
    const { type, id } = deleteConfirmTarget;

    try {
      if (type === 'app') {
        const res = await adminApi.deleteApplication(id);
        if (res.success) {
          showToast(`Application deleted successfully`);
          loadData();
        }
      } else if (type === 'user') {
        const res = await adminApi.deleteUser(id);
        if (res.success) {
          showToast(`User removed successfully`);
          loadData();
        }
      }
    } catch (err) {
      showToast('Deletion failed');
    } finally {
      setDeleteConfirmTarget(null);
    }
  };

  const pendingCount = applications.filter(
    (a) => (a.verificationStatus || a.raw?.verification?.status) === 'Pending'
  ).length;

  return (
    <div className="admin-app-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast animate-fade-in">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage('')}>×</button>
        </div>
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appCount={applications.length}
        dbStatus={dbStatus}
        onRefresh={() => loadData(true)}
      />

      {/* Main Content Area */}
      <div className="admin-main-wrap">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={() => loadData(true)}
          loading={isSyncing}
          pendingCount={pendingCount}
        />

        <main className="admin-content-view">
          {/* View 1: Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              applications={applications}
              onViewApplication={(app) => setActiveDetailApp(app)}
              onGoToApplications={() => setActiveTab('applications')}
              onFilterPending={() => {
                setStatusFilter('Pending');
                setActiveTab('applications');
              }}
            />
          )}

          {/* View 2: Applications Master Table */}
          {activeTab === 'applications' && (
            <ApplicationsTable
              applications={applications}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              modeFilter={modeFilter}
              setModeFilter={setModeFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onViewApplication={(app) => setActiveDetailApp(app)}
              onEditApplication={(app) => setActiveEditApp(app)}
              onDeleteApplication={triggerDeleteApp}
              onPrintSlip={(app) => setActivePrintApp(app)}
              onQuickStatusChange={handleQuickStatusChange}
              loading={isInitialLoad}
            />
          )}

          {/* View 3: Users Management */}
          {activeTab === 'users' && (
            <UsersManagement
              users={users}
              onDeleteUser={triggerDeleteUser}
              onRefresh={() => loadData(true)}
              loading={isSyncing}
            />
          )}
        </main>
      </div>

      {/* Inspect Application Detail Modal */}
      {activeDetailApp && (
        <ApplicationDetailModal
          application={activeDetailApp}
          onClose={() => setActiveDetailApp(null)}
          onSaveVerification={handleSaveVerification}
        />
      )}

      {/* Edit Application Modal */}
      {activeEditApp && (
        <EditApplicationModal
          application={activeEditApp}
          onClose={() => setActiveEditApp(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Printable Receipt Modal */}
      {activePrintApp && (
        <TearOffSlipModal
          application={activePrintApp}
          onClose={() => setActivePrintApp(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmTarget(null)}>
          <div className="modal-dialog-card delete-confirm-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="dcm-body">
              <h3>Confirm Permanent Deletion</h3>
              <p>
                Are you sure you want to permanently delete{' '}
                <strong>{deleteConfirmTarget.name || deleteConfirmTarget.id}</strong>?
                This action cannot be undone.
              </p>
              <div className="dcm-actions">
                <button
                  type="button"
                  className="dash-btn-cancel"
                  onClick={() => setDeleteConfirmTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="dash-btn-delete-confirm"
                  onClick={handleConfirmDelete}
                >
                  Yes, Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
