
const API_BASE_URL = 'http://localhost/backend';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }

    return response;
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) {
    const response = await this.request('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success) {
      this.token = response.token;
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Profile methods
  async getProfile(id: string) {
    return this.request(`/api/profile/${id}`);
  }

  async getAllProfiles() {
    return this.request('/api/profiles');
  }

  async createProfile(data: any) {
    return this.request('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Unit methods
  async getUnits() {
    return this.request('/api/units');
  }

  async createUnit(data: any) {
    return this.request('/api/units', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Log methods
  async createLoadingLog(data: any) {
    return this.request('/api/loading-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createSegelLog(data: any) {
    return this.request('/api/segel-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createKeluarPertaminaLog(data: any) {
    return this.request('/api/keluar-pertamina-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createDokumenLog(data: any) {
    return this.request('/api/dokumen-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createPengawasDepoLog(data: any) {
    return this.request('/api/pengawas-depo-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createFuelmanLog(data: any) {
    return this.request('/api/fuelman-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFuelmanLogs() {
    return this.request('/api/fuelman-logs');
  }

  async getLogsByUnit(unitId: string) {
    return this.request(`/api/logs-by-unit/${unitId}`);
  }

  // File upload method
  async uploadFile(file: File, endpoint: string) {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
