// Mechanics Management
const MechanicsModule = {
    async loadMechanics() {
        try {
            const mechanics = await API.get(getEndpoint(API_CONFIG.ENDPOINTS.MECHANICS));
            this.renderMechanics(mechanics);
        } catch (error) {
            showError('Failed to load mechanics');
            console.error(error);
        }
    },

    renderMechanics(mechanics) {
        const tbody = document.getElementById('mechanics-table');
        
        if (!mechanics || mechanics.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No mechanics found</td></tr>';
            return;
        }

        tbody.innerHTML = mechanics.map(mechanic => `
            <tr>
                <td>${mechanic.id}</td>
                <td>${mechanic.name}</td>
                <td>${mechanic.email}</td>
                <td>${mechanic.phone}</td>
                <td>$${mechanic.salary ? mechanic.salary.toLocaleString() : '0'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="MechanicsModule.editMechanic(${mechanic.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="MechanicsModule.deleteMechanic(${mechanic.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddMechanicModal() {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = 'Add New Mechanic';
        modalBody.innerHTML = `
            <form id="mechanic-form">
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
                <div class="form-group">
                    <label>Salary</label>
                    <input type="number" name="salary" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Mechanic</button>
                </div>
            </form>
        `;

        document.getElementById('mechanic-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createMechanic(new FormData(e.target));
        });

        modal.classList.add('active');
    },

    async createMechanic(formData) {
        try {
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password'),
                salary: parseInt(formData.get('salary'))
            };

            await API.post(getEndpoint(API_CONFIG.ENDPOINTS.MECHANICS), data);
            showSuccess('Mechanic created successfully');
            closeModal();
            this.loadMechanics();
        } catch (error) {
            showError(error.message || 'Failed to create mechanic');
        }
    },

    async editMechanic(id) {
        try {
            const mechanic = await API.get(`${getEndpoint(API_CONFIG.ENDPOINTS.MECHANICS)}/${id}`);
            
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');

            modalTitle.textContent = 'Edit Mechanic';
            modalBody.innerHTML = `
                <form id="mechanic-form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value="${mechanic.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value="${mechanic.email}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="phone" value="${mechanic.phone}" required>
                    </div>
                    <div class="form-group">
                        <label>Password (leave blank to keep current)</label>
                        <input type="password" name="password">
                    </div>
                    <div class="form-group">
                        <label>Salary</label>
                        <input type="number" name="salary" value="${mechanic.salary}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Mechanic</button>
                    </div>
                </form>
            `;

            document.getElementById('mechanic-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateMechanic(id, new FormData(e.target));
            });

            modal.classList.add('active');
        } catch (error) {
            showError('Failed to load mechanic details');
        }
    },

    async updateMechanic(id, formData) {
        try {
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                salary: parseInt(formData.get('salary'))
            };

            const password = formData.get('password');
            if (password) {
                data.password = password;
            }

            await API.put(`${getEndpoint(API_CONFIG.ENDPOINTS.MECHANICS)}/${id}`, data);
            showSuccess('Mechanic updated successfully');
            closeModal();
            this.loadMechanics();
        } catch (error) {
            showError(error.message || 'Failed to update mechanic');
        }
    },

    async deleteMechanic(id) {
        if (!confirm('Are you sure you want to delete this mechanic?')) {
            return;
        }

        try {
            await API.delete(`${getEndpoint(API_CONFIG.ENDPOINTS.MECHANICS)}/${id}`);
            showSuccess('Mechanic deleted successfully');
            this.loadMechanics();
        } catch (error) {
            showError('Failed to delete mechanic');
        }
    }
};
