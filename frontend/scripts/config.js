// API Configuration
const API_CONFIG = {
    // Change this to your deployed API URL or localhost for development
    BASE_URL: 'http://localhost:5001',
    
    ENDPOINTS: {
        CUSTOMERS: '/customers',
        MECHANICS: '/mechanics',
        TICKETS: '/service_tickets',
        INVENTORY: '/inventory',
        LOGIN: '/customers/login'
    }
};

// Get full endpoint URL
function getEndpoint(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}
