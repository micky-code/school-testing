const API_URL = 'http://localhost:5000/api';

export const authService = {
    signup: async (userData) => {
        const response = await fetch(`http://localhost/admindashboard/server/php/signup.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to sign up');
        }
        
        return data;
    },
    
    login: async (credentials) => {
        const response = await fetch(`http://localhost/admindashboard/server/php/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to log in');
        }
        
        // Store the token in localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export const studentService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        return response.json();
    },

    add: async (student) => {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        });
        if (!response.ok) {
            throw new Error('Failed to add student');
        }
        return response.json();
    },

    update: async (id, student) => {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        });
        if (!response.ok) {
            throw new Error('Failed to update student');
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete student');
        }
        return response.json();
    },
    
    uploadList: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_URL}/students/upload`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload student list');
        }
        
        return response.json();
    },
};

export const assignmentService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/assignments`);
        if (!response.ok) {
            throw new Error('Failed to fetch assignments');
        }
        return response.json();
    },

    add: async (assignment) => {
        const response = await fetch(`${API_URL}/assignments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
        });
        if (!response.ok) {
            throw new Error('Failed to add assignment');
        }
        return response.json();
    },

    update: async (id, assignment) => {
        const response = await fetch(`${API_URL}/assignments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
        });
        if (!response.ok) {
            throw new Error('Failed to update assignment');
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/assignments/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete assignment');
        }
        return response.json();
    },
};

export const chatService = {
    connectWebSocket: () => {
        // Create a mock WebSocket or return a placeholder if the backend doesn't support WebSockets yet
        // In a real application, you would connect to a WebSocket server here
        console.log('WebSocket connection would be established here in a real application');
        
        // Return a mock WebSocket object with the expected methods
        return {
            send: (data) => console.log('WebSocket would send:', data),
            close: () => console.log('WebSocket would be closed'),
            onmessage: null,
            onopen: null,
            onclose: null,
            onerror: null
        };
    },
    
    getMessages: async (params) => {
        const queryParams = new URLSearchParams();
        if (params.sender_id) queryParams.append('sender_id', params.sender_id);
        if (params.sender_type) queryParams.append('sender_type', params.sender_type);
        if (params.receiver_id) queryParams.append('receiver_id', params.receiver_id);
        if (params.receiver_type) queryParams.append('receiver_type', params.receiver_type);
        if (params.assignment_id) queryParams.append('assignment_id', params.assignment_id);

        const response = await fetch(`${API_URL}/chat/messages?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        return response.json();
    },

    sendMessage: async (message) => {
        const response = await fetch(`${API_URL}/chat/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        return response.json();
    },

    markAsRead: async (params) => {
        const response = await fetch(`${API_URL}/chat/messages/mark-read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });
        if (!response.ok) {
            throw new Error('Failed to mark messages as read');
        }
        return response.json();
    },

    getUnreadCount: async (receiverId, receiverType) => {
        const queryParams = new URLSearchParams();
        queryParams.append('receiver_id', receiverId);
        queryParams.append('receiver_type', receiverType);

        const response = await fetch(`${API_URL}/chat/unread-count?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to get unread count');
        }
        return response.json();
    },
    
    uploadFile: async (formData) => {
        const response = await fetch(`${API_URL}/chat/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Failed to upload file');
        }
        return response.json();
    },
};

export const courseService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/courses`);
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        return response.json();
    },

    add: async (course) => {
        const response = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        });
        if (!response.ok) {
            throw new Error('Failed to add course');
        }
        return response.json();
    },

    update: async (id, course) => {
        const response = await fetch(`${API_URL}/courses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        });
        if (!response.ok) {
            throw new Error('Failed to update course');
        }
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/courses/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete course');
        }
        return response.json();
    },
};
