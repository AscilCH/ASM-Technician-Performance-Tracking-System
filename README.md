# ASM Technician Performance Tracking System

![license](https://img.shields.io/badge/license-MIT-blue.svg)

> A comprehensive system for tracking and managing the performance of technicians in ASM (Assembly and Manufacturing). The system is divided into three main projects: a Technician Dashboard, an Admin Dashboard, and a Backend API. The frontend is developed using AngularJS and SCSS, while the backend is powered by Laravel and MySQL.

![preview](public/assets/system_preview.jpg)

## Project Overview

### 1. Technician Dashboard

The Technician Dashboard provides technicians with real-time insights into their performance, tasks, and goals. Key features include:

- **Task Management**: View and manage assigned tasks.
- **Performance Metrics**: Monitor individual performance metrics and progress.
- **User Interface**: Built using AngularJS and SCSS for a responsive and modern interface.

### 2. Admin Dashboard

The Admin Dashboard is designed for supervisors and managers to oversee the performance of all technicians. It includes features such as:

- **Technician Monitoring**: View detailed performance data for each technician.
- **Reporting**: Generate reports on technician performance and overall productivity.
- **User Management**: Manage technician accounts, roles, and permissions.
- **Advanced Data Visualization**: Graphs and charts powered by AngularJS for clear data representation.
- **Email Service**: Automatically send emails for mission assignments and a congratulatory email to the top-ranked technician based on the scoring system.

### 3. Backend API

The Backend API is the core of the system, handling data processing, storage, and business logic. It is built using Laravel and MySQL. Key functionalities include:

- **RESTful API**: Provides endpoints for the Technician and Admin Dashboards.
- **Database Management**: MySQL database for storing technician data, performance metrics, and reports.
- **Authentication**: Secure authentication and role-based access control.
- **Email Notifications**: Automated emails for mission assignments and recognition of top-performing technicians.
- **Soft Delete**: Implemented soft delete functionality to safely manage record deletions without losing data permanently.

## Technologies Used

- **Frontend**: AngularJS, SCSS
- **Backend**: Laravel, MySQL
- **API**: RESTful API with Laravel
- **Data Visualization**: AngularJS charts and graphs
- **Email Services**: Integrated with backend to send automated emails

## Getting Started

### Prerequisites

- **Node.js and npm**: Required for the frontend projects.
- **PHP and Composer**: Required for the Laravel backend.
- **MySQL**: Database setup.

### Installation

#### Install Frontend Dependencies

Navigate to the Technician and Admin Dashboard directories and run:

```bash
npm install
```

#### Install Backend Dependencies

Navigate to the Backend API directory and run:

```bash
composer install
```

#### Database Setup

Configure your MySQL database settings in the `.env` file of the Backend API:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Run database migrations:

```bash
php artisan migrate
```

### Running the Projects

#### Start the Technician Dashboard

```bash
cd technician-dashboard
ng serve
```

#### Start the Admin Dashboard

```bash
cd admin-dashboard
ng serve
```

#### Start the Backend API

```bash
cd backend-api
php artisan serve
```

---

This change reflects the correct command for starting an Angular project. If there's anything else you need, feel free to ask!

### Usage

- **Technician Dashboard**: Access at `http://localhost:4200` to manage tasks and monitor performance.
- **Admin Dashboard**: Access at `http://localhost:4201` to oversee technician performance, assign missions, and generate reports.
- **Backend API**: Available at `http://localhost:8000/api` for data management, email notifications, and business logic.

## Scoring System and Email Notifications

- **Scoring System**: Technicians are ranked based on performance metrics. The system automatically calculates scores and updates rankings.
- **Automated Email Notifications**: 
  - **Mission Assignment**: Automatically sends an email to the technician when a new mission is assigned.
  - **Top Technician Recognition**: Sends a congratulatory email to the technician with the highest score each month.

## Soft Delete Functionality

- **Soft Delete**: Records are not permanently deleted but are instead marked as deleted, allowing for recovery or permanent deletion at a later time.

## Contributing

Contributions to the project are welcome! Please fork the repositories and submit pull requests for new features, bug fixes, or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/YourUsername/backend-api/blob/main/LICENSE.md) file for more information.

## Contact

For questions or support regarding this project:

- **Email**: [ascil.chtioui@gmail.com](mailto:ascil.chtioui@gmail.com)

---
