// Base API URL
const API_BASE_URL = 'https://government-services.runasp.net';

// Helper function for handling API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: 'حدث خطأ في الاتصال بالخادم'
        }));
        throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم');
    }
    return response.json();
};

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Create headers with auth token if available
const createHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

// API Services
export const authService = {
    // Login for regular users
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/Auth/Login`, {
            method: 'POST',
            headers: createHeaders(false),
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    // Login for admin users
    adminLogin: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/Auth/AdminLogin`, {
            method: 'POST',
            headers: createHeaders(false),
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    // Register a new user
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/Auth/Register`, {
            method: 'POST',
            headers: createHeaders(false),
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },
};

export const servicesService = {
    // Get all services
    getAllServices: async () => {
        const response = await fetch(`${API_BASE_URL}/api/Services/All`);
        return handleResponse(response);
    },

    // Get service by ID
    getServiceById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/api/Services/${id}`);
        return handleResponse(response);
    },

    // Get service fields
    getServiceFields: async (id) => {
        const response = await fetch(`${API_BASE_URL}/api/Requests/${id}/fields`);
        return handleResponse(response);
    },

    // Get required documents
    getRequiredDocuments: async (id) => {
        const response = await fetch(`${API_BASE_URL}/api/Requests/${id}/documents`);
        return handleResponse(response);
    },
};

export const requestsService = {
    // Get user requests
    getUserRequests: async () => {
        const response = await fetch(`${API_BASE_URL}/api/Requests/User`, {
            headers: createHeaders(),
        });
        return handleResponse(response);
    },

    // Get all requests (admin only)
    getAllRequests: async () => {
        const response = await fetch(`${API_BASE_URL}/api/Requests/All`, {
            headers: createHeaders(),
        });
        return handleResponse(response);
    },

    // Submit a new request
    submitRequest: async (requestData) => {
        const response = await fetch(`${API_BASE_URL}/api/Requests/Submit`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(requestData),
        });
        return handleResponse(response);
    },

    // Update request status (admin only)
    updateRequestStatus: async (requestId, status) => {
        const response = await fetch(`${API_BASE_URL}/api/Requests/${requestId}/status`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    },
};

export const adminService = {
    // Get dashboard statistics
    getDashboardStats: async () => {
        const response = await fetch(`${API_BASE_URL}/api/Admin/Dashboard`, {
            headers: createHeaders(),
        });
        return handleResponse(response);
    },

    // Add a new service
    addService: async (serviceData) => {
        const response = await fetch(`${API_BASE_URL}/api/Services/Add`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(serviceData),
        });
        return handleResponse(response);
    },

    // Update a service
    updateService: async (serviceId, serviceData) => {
        const response = await fetch(`${API_BASE_URL}/api/Services/${serviceId}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(serviceData),
        });
        return handleResponse(response);
    },

    // Delete a service
    deleteService: async (serviceId) => {
        const response = await fetch(`${API_BASE_URL}/api/Services/${serviceId}`, {
            method: 'DELETE',
            headers: createHeaders(),
        });
        return handleResponse(response);
    },
};
