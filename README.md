# Secure File Hub

**Secure File Hub** is a full-stack web application designed for secure user authentication and file management. Users can log in, upload files to a dedicated FTP/SFTP server, and view their upload history. The application features a stunning, animated user interface and a powerful admin panel for complete oversight of all user activity and server files.

This project is built with a modern tech stack, featuring a **Node.js/Express** backend and a **React/Vite** frontend, and is designed for deployment on an Ubuntu server with Nginx.

---

## ✨ Features

### User Features

- **🔐 Secure Authentication:** JWT-based login system with password hashing.
- **🚀 File Uploads:** Users can upload files, which are securely stored on a dedicated FTP/SFTP server.
- **📂 Daily Organization:** Files are automatically organized into folders named by the current date on the server.
- **📜 Upload History:** Users can see a list of files they have successfully uploaded.
- **💅 Beautiful UI:** A stunning, animated, and fully responsive user interface built with glassmorphism design principles.

### Admin Features

- **👑 Role-Based Access:** Separate, protected dashboard accessible only to admin users.
- **📊 At-a-Glance Stats:** An admin dashboard with key metrics: total uploads, total users, and total storage used.
- **📈 Activity Chart:** An interactive bar chart visualizing the number of uploads per user.
- **🗂️ Centralized File Management:** View a paginated table of all files uploaded by all users through the application.
- **🌐 Live FTP/SFTP Browser:** A powerful, real-time file browser that lists all files and folders directly from the server's storage directory.
- **🔽 Secure Downloads:** Admins can securely download any file directly from the server through the admin panel.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** React (with Vite), React Router
- **Styling:** Chakra UI (for the admin panel) and custom CSS (for the user-facing pages)
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js
- **File Transfer:** SFTP (using `ssh2-sftp-client`)
- **Server:** Ubuntu, Nginx (as a reverse proxy), PM2 (for process management)
- **FTP/SFTP Server:** vsftpd or OpenSSH's built-in SFTP subsystem.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later)
- An Ubuntu server (for deployment)
- A configured FTP or SFTP server
- Git

# Navigate to the backend folder

cd backend

# Install dependencies

npm install

# Create a .env file (copy from .env.example if available)

touch .env

# Port for the backend server

PORT=5000

# SFTP Server Details (for file uploads)

SFTP_HOST=your_sftp_server_ip
SFTP_PORT=22
SFTP_USER=your_sftp_uploader_username
SFTP_PASSWORD=your_sftp_uploader_password

# JWT Secret for token generation

JWT_SECRET=a_strong_secret_key_for_development

npm start

# Navigate to the frontend folder

cd ../frontend

# Install dependencies

npm install

npm run dev

🖼️ Screenshots
![GitHub Image](/screenshots/1.png)
![GitHub Image](/screenshots/2.png)
![GitHub Image](/screenshots/3.png)
![GitHub Image](/screenshots/4.png)
