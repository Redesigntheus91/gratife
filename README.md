# Gratife Gaming

Welcome to the Gratife Gaming website and inventory management system.

## About

Gratife Gaming buys and sells gaming items and offers repair services. You can reach us on social media:
- [Instagram](https://www.instagram.com/gratife_gaming/)
- [TikTok](https://www.tiktok.com/@gratife_gaming)
- [YouTube](https://www.youtube.com/@gratife6378)
- [Mercari](https://www.mercari.com/u/gratife/)
- [eBay](https://www.ebay.com/usr/gratife)

## Inventory Management

The inventory manager is available at **`/inventory`** (or at `https://gratife.com/inventory`).

### Features
- **Quick-add presets**: Add common items with a single click
- **Real-time tracking**: View total item count and individual quantities
- **Easy adjustments**: Increment/decrement quantities or remove items
- **Password-protected**: Simple optional authentication to prevent unauthorized access

### Default Password
Password: `letmein`

### How to Use
1. Navigate to `/inventory`
2. Enter the password when prompted
3. Click preset buttons to add items
4. Use `+` / `−` buttons to adjust quantities
5. Click "Delete" to remove items
6. Click "Logout" to exit

## Project Structure

```
gratife/
├── index.html                          # Homepage
├── inventory.html                      # Redirect to /inventory (kept for legacy)
├── server/
│   ├── index.js                        # Express API server
│   ├── package.json                    # Dependencies
│   ├── db.json                         # Inventory data store
│   └── public/
│       └── inventory/
│           ├── index.html              # Inventory UI
│           ├── styles.css              # Styles
│           └── app.js                  # Application logic
├── README.md                           # This file
└── CNAME                               # Custom domain config
```

## Local Development

### Prerequisites
- Node.js v24.x
- npm v11.9.0

### Setup
```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:3000`. Inventory is available at `http://localhost:3000/inventory`.

## API Endpoints

### Get all items
```
GET /api/items
```
Returns array of items.

### Create new item
```
POST /api/items
Content-Type: application/json

{ "title": "Item Name", "qty": 1 }
```

### Update item
```
PUT /api/items/:id
Content-Type: application/json

{ "qty": 5 }
```

### Delete item
```
DELETE /api/items/:id
```

## Deployment

Deployed on [Render](https://render.com/) with automatic GitHub integration. Pushes to the `main` branch trigger auto-deployment.

Custom domain: `gratife.com` (via Squarespace DNS)

## Notes

- The inventory system uses a JSON file (`server/db.json`) as a simple database.
- Authentication is currently client-side and session-based via localStorage (temporary solution).
- For production use, consider implementing server-side authentication and a proper database.
