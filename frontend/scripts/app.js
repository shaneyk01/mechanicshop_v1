// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupModalHandlers();
    setupButtonHandlers();
    loadDashboard();
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Get page name
            const pageName = this.getAttribute('data-page');
            
            // Update page title
            const titles = {
                'dashboard': 'Dashboard',
                'customers': 'Customers',
                'mechanics': 'Mechanics',
                'tickets': 'Service Tickets',
                'inventory': 'Inventory'
            };
            document.getElementById('page-title').textContent = titles[pageName];
            
            // Show corresponding page
            showPage(pageName);
        });
    });
}

function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Load data for the page
        loadPageData(pageName);
    }
}

function loadPageData(pageName) {
    switch(pageName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'customers':
            CustomersModule.loadCustomers();
            break;
        case 'mechanics':
            MechanicsModule.loadMechanics();
            break;
        case 'tickets':
            TicketsModule.loadTickets();
            break;
        case 'inventory':
            InventoryModule.loadInventory();
            break;
    }
}

// Dashboard
async function loadDashboard() {
    try {
        // Load all data in parallel
        const [customers, mechanics, tickets, inventory] = await Promise.all([
            API.get(getEndpoint(API_CONFIG.ENDPOINTS.CUSTOMERS)),
            API.get(getEndpoint(API_CONFIG.ENDPOINTS.MECHANICS)),
            API.get(getEndpoint(API_CONFIG.ENDPOINTS.TICKETS)),
            API.get(getEndpoint(API_CONFIG.ENDPOINTS.INVENTORY))
        ]);

        // Update stats
        document.getElementById('total-customers').textContent = customers.length;
        document.getElementById('total-mechanics').textContent = mechanics.length;
        document.getElementById('total-tickets').textContent = tickets.length;
        document.getElementById('total-inventory').textContent = inventory.length;

        // Show recent activity
        displayRecentActivity(tickets);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

function displayRecentActivity(tickets) {
    const activityList = document.getElementById('recent-activity');
    
    if (!tickets || tickets.length === 0) {
        activityList.innerHTML = '<p class="text-muted">No recent activity</p>';
        return;
    }

    // Show last 5 tickets
    const recentTickets = tickets.slice(-5).reverse();
    
    activityList.innerHTML = recentTickets.map(ticket => `
        <div class="activity-item" style="padding: 12px; border-bottom: 1px solid var(--border-color);">
            <strong>Ticket #${ticket.id}</strong> - ${ticket.service_description || 'No description'}
            <br>
            <small class="text-muted">${ticket.Date || 'No date'}</small>
        </div>
    `).join('');
}

// Modal Handlers
function setupModalHandlers() {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('close-modal');
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

// Button Handlers
function setupButtonHandlers() {
    // Add Customer
    document.getElementById('add-customer-btn').addEventListener('click', () => {
        CustomersModule.showAddCustomerModal();
    });

    // Add Mechanic
    document.getElementById('add-mechanic-btn').addEventListener('click', () => {
        MechanicsModule.showAddMechanicModal();
    });

    // Add Ticket
    document.getElementById('add-ticket-btn').addEventListener('click', () => {
        TicketsModule.showAddTicketModal();
    });

    // Add Inventory
    document.getElementById('add-inventory-btn').addEventListener('click', () => {
        InventoryModule.showAddItemModal();
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        showSuccess('Logged out successfully');
        // Reload page or redirect to login
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
}

// Make closeModal globally available
window.closeModal = closeModal;
