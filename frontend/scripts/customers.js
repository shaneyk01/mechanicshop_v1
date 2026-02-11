// Customers Management
const CustomersModule = {
    async loadCustomers() {
        try {
            const customers = await API.get(getEndpoint(API_CONFIG.ENDPOINTS.CUSTOMERS));
            this.renderCustomers(customers);
        } catch (error) {
            showError('Failed to load customers');
            console.error(error);
        }
    },

    renderCustomers(customers) {
        const tbody = document.getElementById('customers-table');
        
        if (!customers || customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No customers found</td></tr>';
            return;
        }

        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="CustomersModule.editCustomer(${customer.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="CustomersModule.deleteCustomer(${customer.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddCustomerModal() {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = 'Add New Customer';
        modalBody.innerHTML = `
            <form id="customer-form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Customer</button>
                </div>
            </form>
        `;

        document.getElementById('customer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCustomer(new FormData(e.target));
        });

        modal.classList.add('active');
    },

    async createCustomer(formData) {
        try {
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password')
            };

            await API.post(getEndpoint(API_CONFIG.ENDPOINTS.CUSTOMERS), data);
            showSuccess('Customer created successfully');
            closeModal();
            this.loadCustomers();
        } catch (error) {
            showError(error.message || 'Failed to create customer');
        }
    },

    async editCustomer(id) {
        try {
            const customer = await API.get(`${getEndpoint(API_CONFIG.ENDPOINTS.CUSTOMERS)}/${id}`);
            
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');

            modalTitle.textContent = 'Edit Customer';
            modalBody.innerHTML = `
                <form id="customer-form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value="${customer.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value="${customer.email}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" value="${customer.phone}" required>
                    </div>
                    <div class="form-group">
                        <label>Password (leave blank to keep current)</label>
                        <input type="password" name="password">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Customer</button>
                    </div>
                </form>
            `;

            document.getElementById('customer-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateCustomer(id, new FormData(e.target));
            });

            modal.classList.add('active');
        } catch (error) {
            showError('Failed to load customer details');
        }
    },

    async updateCustomer(id, formData) {
        try {
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone')
            };

            const password = formData.get('password');
            if (password) {
                data.password = password;
            }

            await API.put(`${getEndpoint(API_CONFIG.ENDPOINTS.CUSTOMERS)}/${id}`, data);
            showSuccess('Customer updated successfully');
            closeModal();
            this.loadCustomers();
        } catch (error) {
            showError(error.message || 'Failed to update customer');
        }
    },

    async deleteCustomer(id) {
        if (!confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        try {
            await API.delete(`${getEndpoint(API_CONFIG.ENDPOINTS.CUSTOMERS)}/${id}`);
            showSuccess('Customer deleted successfully');
            this.loadCustomers();
        } catch (error) {
            showError('Failed to delete customer');
        }
    }
};
