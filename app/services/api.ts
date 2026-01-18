const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface FetchOptions extends RequestInit {
  needsAuth?: boolean;
}

export class ApiClient {
  private static getHeaders(options: FetchOptions = {}): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (options.needsAuth !== false) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  static async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'GET',
      headers: this.getHeaders(options),
    });

    return this.handleResponse(response);
  }

  static async post<T>(endpoint: string, data?: any, options: FetchOptions = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(options),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse(response);
  }

  static async put<T>(endpoint: string, data?: any, options: FetchOptions = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      headers: this.getHeaders(options),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse(response);
  }

  static async patch<T>(endpoint: string, data?: any, options: FetchOptions = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'PATCH',
      headers: this.getHeaders(options),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse(response);
  }

  static async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
      headers: this.getHeaders(options),
    });

    return this.handleResponse(response);
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }
    return response.json();
  }
}

export default ApiClient;
