const API_URL = 'https://coc-tracker-xdb6.onrender.com/api';

class ApiService {
  constructor() {
    this.token = this.getCookie('token');
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      this.setCookie('token', token);
    } else {
      this.deleteCookie('token');
    }
  }

  getToken() {
    return this.token || this.getCookie('token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async signup(email, password, name, profilePicture = null) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, profilePicture }),
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async resetPassword(email) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPasswordConfirm(token, newPassword) {
    const data = await this.request('/auth/reset-password-confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
    this.setToken(data.token);
    return data;
  }

  async verifyToken() {
    try {
      return await this.request('/auth/verify');
    } catch (error) {
      this.setToken(null);
      throw error;
    }
  }

  logout() {
    this.setToken(null);
  }

  // Task methods
  async getTasks() {
    return await this.request('/tasks');
  }

  async createTask(taskData) {
    return await this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId) {
    return await this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async updateTask(taskId, taskData) {
    return await this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }
}

export default new ApiService();
