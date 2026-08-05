# ⚡ Shelf-Sync

> **Hyperlocal Quick-Commerce & Darkstore Real-Time Inventory Sync Platform**

**Shelf-Sync** is a dual-application web platform built with React, Vite, TailwindCSS, and Firebase. It bridges local grocery darkstore owners with nearby customers through real-time inventory management, OpenStreetMap GPS auto-location detection, and automated customer restock notifications.

---

## 🌟 Key Features

### 🛒 **Customer Web Application (`/customer-app`)**
* **📍 Live OpenStreetMap GPS Geolocation:** Auto-detects exact customer location via device GPS and reverse geocoding.
* **🏪 Real-time Store Discovery:** Dynamically lists nearby registered darkstores and local markets from Firebase Firestore.
* **⚡ Live Inventory Tracking:** View live product stock, low-stock warnings, and out-of-stock statuses in real time.
* **🔔 Restock Notifications:** Subscribe to out-of-stock items and get notified when shop owners replenish inventory.

### 🏪 **Shop Owner Web Application (`/owner-app`)**
* **📝 Instant Darkstore Registration:** Register new darkstores with auto-detected GPS shop location.
* **📦 Live Product Catalog Management:** Add, edit stock quantities inline (+ / -), and set restock ETA schedules.
* **📊 Customer Demand Analytics:** Track out-of-stock item request volume from nearby customers to prioritize restocks.
* **🔄 Cross-Platform Real-Time Sync:** Stock changes publish instantly to nearby customers without page refreshes.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 18 + Vite
* **Styling:** TailwindCSS, Glassmorphism Aesthetics, Lucide React Icons
* **Backend & Database:** Firebase Authentication & Firebase Firestore NoSQL Database
* **Geolocation Service:** OpenStreetMap Nominatim API + HTML5 Geolocation API

---

## 🚀 Getting Started

### 1. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/tharunreddyvallapureddy-bit/Shelf-Sync.git
cd Shelf-Sync

# Install dependencies for both apps
npm run install:all
```

### 2. Running Dev Servers
```bash
# Run Customer Web App (Port 5173)
npm run dev:customer

# Run Shop Owner Web App (Port 5174)
npm run dev:owner
```

---

## 📂 Project Architecture

```
Shelf-Sync/
├── customer-app/        # Customer Storefront Web Portal (port 5173)
│   ├── src/
│   │   ├── components/  # CustomerPortal, ProductCard, LocationModal, etc.
│   │   ├── context/     # AppContext, AuthContext (Firebase listeners)
│   │   └── utils/       # OpenStreetMap Nominatim Reverse Geocoding
├── owner-app/           # Shop Owner Inventory Hub (port 5174)
│   ├── src/
│   │   ├── components/  # OwnerPortal, AddProductModal, RestockModal
│   │   └── utils/       # OpenStreetMap Nominatim Reverse Geocoding
└── package.json         # Platform root scripts
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
