# Direction Map

Direction map web application using React and Laravel

## Tech Stack

### Backend
- **Laravel 11** - PHP Framework
- **Inertia.js** - Modern monolith architecture
- **MySQL** - Database

### Frontend
- **React** - UI Library
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps
- **Lucide React** - Icons

### APIs
- **OpenStreetMap Nominatim** - Geocoding
- **OSRM** - Route calculations


## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd direction-map
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install Node Dependencies
```bash
npm install
```

### 4. Install Lucide React Icons
```bash
npm install lucide-react
```

### 5. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database credentials:
```env
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Run Migrations
```bash
php artisan migrate
```

### 7. Build Assets
```bash
npm run dev
```

### 8. Start the Server
```bash
php artisan serve
```

## AI Tools Used

- Claude - Debugging, and feature implementation
- ChatGPT - Documentation and problem-solving assistance



