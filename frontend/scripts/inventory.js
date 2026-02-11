// Inventory Management
const InventoryModule = {
    async loadInventory() {
        try {
            const items = await API.get(getEndpoint(API_CONFIG.ENDPOINTS.INVENTORY));
            this.renderInventory(items);
        } catch (error) {
            showError('Failed to load inventory');
            console.error(error);
        }
    },

    renderInventory(items) {
        const tbody = document.getElementById('inventory-table');
        
        if (!items || items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No inventory items found</td></tr>';
            return;
        }

        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>$${item.price ? item.price.toFixed(2) : '0.00'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="InventoryModule.editItem(${item.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="InventoryModule.deleteItem(${item.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    showAddItemModal() {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = 'Add New Inventory Item';
        modalBody.innerHTML = `
            <form id="inventory-form">
                <div class="form-group">
                    <label>Item Name</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Price</label>
                    <input type="number" name="price" step="0.01" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Item</button>
                </div>
            </form>
        `;

        document.getElementById('inventory-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createItem(new FormData(e.target));
        });

        modal.classList.add('active');
    },

    async createItem(formData) {
        try {
            const data = {
                name: formData.get('name'),
                price: parseFloat(formData.get('price'))
            };

            await API.post(getEndpoint(API_CONFIG.ENDPOINTS.INVENTORY), data);
            showSuccess('Inventory item created successfully');
            closeModal();
            this.loadInventory();
        } catch (error) {
            showError(error.message || 'Failed to create inventory item');
        }
    },

    async editItem(id) {
        try {
            const item = await API.get(`${getEndpoint(API_CONFIG.ENDPOINTS.INVENTORY)}/${id}`);
            
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modal-title');
            const modalBody = document.getElementById('modal-body');

            modalTitle.textContent = 'Edit Inventory Item';
            modalBody.innerHTML = `
                <form id="inventory-form">
                    <div class="form-group">
                        <label>Item Name</label>
                        <input type="text" name="name" value="${item.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Price</label>
                        <input type="number" name="price" step="0.01" value="${item.price}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Item</button>
                    </div>
                </form>
            `;

            document.getElementById('inventory-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateItem(id, new FormData(e.target));
            });

            modal.classList.add('active');
        } catch (error) {
            showError('Failed to load item details');
        }
    },

    async updateItem(id, formData) {
        try {
            const data = {
                name: formData.get('name'),
                price: parseFloat(formData.get('price'))
            };

            await API.put(`${getEndpoint(API_CONFIG.ENDPOINTS.INVENTORY)}/${id}`, data);
            showSuccess('Inventory item updated successfully');
            closeModal();
            this.loadInventory();
        } catch (error) {
            showError(error.message || 'Failed to update inventory item');
        }
    },

    async deleteItem(id) {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await API.delete(`${getEndpoint(API_CONFIG.ENDPOINTS.INVENTORY)}/${id}`);
            showSuccess('Inventory item deleted successfully');
            this.loadInventory();
        } catch (error) {
            showError('Failed to delete inventory item');
        }
    }
};
