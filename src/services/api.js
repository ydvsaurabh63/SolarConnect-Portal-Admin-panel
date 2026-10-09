const API_BASE = 'http://localhost:4000/api';

export const adminApi = {
  // 1. Health check
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (err) {
      return { status: 'offline', database: 'Offline' };
    }
  },

  // 2. Overview Statistics
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      return await res.json();
    } catch (err) {
      return { success: false, stats: { total: 0, pending: 0, done: 0, docsComplete: 0 } };
    }
  },

  // 3. Get all applications / submission log
  async getApplications(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.search) query.append('search', params.search);

    const url = `${API_BASE}/submission-log?${query.toString()}`;
    const res = await fetch(url);
    return await res.json();
  },

  // 4. Get single application by ID
  async getApplication(id) {
    const res = await fetch(`${API_BASE}/registrations/${id}`);
    return await res.json();
  },

  // 5. Update Verification Status & Remarks
  async updateVerification(id, status, remarks, verifiedBy = 'Admin Controller') {
    const res = await fetch(`${API_BASE}/registrations/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, remarks, verifiedBy }),
    });
    return await res.json();
  },

  // 6. Update Application details
  async updateApplication(id, updates) {
    const res = await fetch(`${API_BASE}/registrations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  // 7. Delete Application
  async deleteApplication(id) {
    const res = await fetch(`${API_BASE}/registrations/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  // 8. Get Users list
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/users`);
      return await res.json();
    } catch (err) {
      return { success: false, users: [] };
    }
  },

  // 9. Delete User
  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },
};
