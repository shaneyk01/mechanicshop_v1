# Mechanic Shop Frontend

Modern, responsive frontend UI for the Mechanic Shop API.

## Features

- **Dashboard** - Overview with statistics and recent activity
- **Customers Management** - Create, read, update, delete customers
- **Mechanics Management** - Manage mechanic profiles and salaries
- **Service Tickets** - Track and manage service tickets
- **Inventory Management** - Manage parts and pricing

## Setup

### 1. Configure API URL

Edit `scripts/config.js` and set your API base URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',  // Change this to your API URL
    // ...
};
```

### 2. Enable CORS on Backend

Your Flask API needs to allow CORS. Install flask-cors:

```bash
pip install flask-cors
```

Add to your Flask app:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
```

### 3. Run the Frontend

Simply open `index.html` in a web browser, or use a local server:

**Using Python:**
```bash
cd frontend
python -m http.server 8000
```

Then visit: http://localhost:8000

**Using Node.js:**
```bash
cd frontend
npx http-server -p 8000
```

**Using VS Code:**
Install the "Live Server" extension and right-click on `index.html` → "Open with Live Server"

## File Structure

```
frontend/
├── index.html           # Main HTML file
├── styles/
│   └── main.css        # All styling
├── scripts/
│   ├── config.js       # API configuration
│   ├── api.js          # API service layer
│   ├── customers.js    # Customer management
│   ├── mechanics.js    # Mechanic management
│   ├── tickets.js      # Service ticket management
│   ├── inventory.js    # Inventory management
│   └── app.js          # Main application logic
└── README.md
```

## Usage

1. **Dashboard** - View statistics and recent activity
2. **Navigate** - Use sidebar to switch between sections
3. **Create** - Click "+ Add" buttons to create new records
4. **Edit** - Click "Edit" button on any row
5. **Delete** - Click "Delete" button (with confirmation)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- No build process required - just HTML, CSS, and vanilla JavaScript
- Uses Font Awesome icons via CDN
- Fully responsive design
- Modal-based forms for create/edit operations
