// Service Tickets Management
const TicketsModule = {
    customers: [],
    mechanics: [],

    async loadTickets() {
        try {
            const tickets = await API.get(getEndpoint(API_CONFIG.ENDPOINTS.TICKETS));
            this.renderTickets(tickets);
        } catch (error) {
            showError('Failed to load service tickets');
            console.error(error);
        }
    },

    async loadCustomersAndMechanics() {
        try {
            this.customers = await API.get(getEndpoint(API_CONFIG.ENDPOINTS.CUSTOMERS));
            this.mechanics = await API.get(getEndpoint(API_CONFIG.ENDPOINTS.MECHANICS));
        } catch (error) {
            console.error('Failed to load customers/mechanics', error);
        }
    },

    renderTickets(tickets) {
        const tbody = document.getElementById('tickets-table');
        
        if (!tickets || tickets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No service tickets found</td></tr>';
            return;
        }

        tbody.innerHTML = tickets.map(ticket => `
            <tr>
                <td>${ticket.id}</td>
                <td>${ticket.customer_id}</td>
                <td>${ticket.mechanic_id}</td>
                <td>${ticket.Date || 'N/A'}</td>
                <td>${ticket.service_description || 'N/A'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="TicketsModule.editTicket(${ticket.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="TicketsModule.deleteTicket(${ticket.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    async showAddTicketModal() {
        await this.loadCustomersAndMechanics();
        
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = 'Create New Service Ticket';
        modalBody.innerHTML = `
            <form id="ticket-form">
                <div class="form-group">
                    <label>Customer</label>
                    <select name="customer_id" required>
                        <option value="">Select Customer</option>
                        ${this.customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Mechanic</label>
                    <select name="mechanic_id" required>
                        <option value="">Select Mechanic</option>
                        ${this.mechanics.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" name="Date" required>
                </div>
                <div class="form-group">
                    <label>Service Description</label>
                    <textarea name="service_description" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create Ticket</button>
                </div>
            </form>
        `;

        document.getElementById('ticket-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTicket(new FormData(e.target));
        });

        modal.classList.add('active');
    },

    async createTicket(formData) {
        try {
            const data = {
                customer_id: parseInt(formData.get('customer_id')),
                mechanic_id: parseInt(formData.get('mechanic_id')),
                Date: formData.get('Date'),
                service_description: formData.get('service_description')
            };

            await API.post(getEndpoint(API_CONFIG.ENDPOINTS.TICKETS), data);
            showSuccess('Service ticket created successfully');
            closeModal();
            this.loadTickets();
        } catch (error) {
            showError(error.message || 'Failed to create service ticket');
        }
    },

    async editTicket(id) {
        try {
            await this.loadCustomersAndMechanics();
            const ticket = await API.get(`${getEndpoint(API_CONFIG.ENDPOINTS.TICKETS)}/${id}`);
            
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');

            modalTitle.textContent = 'Edit Service Ticket';
            modalBody.innerHTML = `
                <form id="ticket-form">
                    <div class="form-group">
                        <label>Customer</label>
                        <select name="customer_id" required>
                            <option value="">Select Customer</option>
                            ${this.customers.map(c => `
                                <option value="${c.id}" ${c.id === ticket.customer_id ? 'selected' : ''}>
                                    ${c.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Mechanic</label>
                        <select name="mechanic_id" required>
                            <option value="">Select Mechanic</option>
                            ${this.mechanics.map(m => `
                                <option value="${m.id}" ${m.id === ticket.mechanic_id ? 'selected' : ''}>
                                    ${m.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" name="Date" value="${ticket.Date}" required>
                    </div>
                    <div class="form-group">
                        <label>Service Description</label>
                        <textarea name="service_description" required>${ticket.service_description}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Ticket</button>
                    </div>
                </form>
            `;

            document.getElementById('ticket-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateTicket(id, new FormData(e.target));
            });

            modal.classList.add('active');
        } catch (error) {
            showError('Failed to load ticket details');
        }
    },

    async updateTicket(id, formData) {
        try {
            const data = {
                customer_id: parseInt(formData.get('customer_id')),
                mechanic_id: parseInt(formData.get('mechanic_id')),
                Date: formData.get('Date'),
                service_description: formData.get('service_description')
            };

            await API.put(`${getEndpoint(API_CONFIG.ENDPOINTS.TICKETS)}/${id}`, data);
            showSuccess('Service ticket updated successfully');
            closeModal();
            this.loadTickets();
        } catch (error) {
            showError(error.message || 'Failed to update service ticket');
        }
    },

    async deleteTicket(id) {
        if (!confirm('Are you sure you want to delete this service ticket?')) {
            return;
        }

        try {
            await API.delete(`${getEndpoint(API_CONFIG.ENDPOINTS.TICKETS)}/${id}`);
            showSuccess('Service ticket deleted successfully');
            this.loadTickets();
        } catch (error) {
            showError('Failed to delete service ticket');
        }
    }
};
