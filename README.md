<div align="center">

<br/>

```
 ███╗   ███╗███████╗ █████╗ ██╗      ██████╗ ██████╗ ███╗   ██╗███╗   ██╗███████╗ ██████╗████████╗
 ████╗ ████║██╔════╝██╔══██╗██║     ██╔════╝██╔═══██╗████╗  ██║████╗  ██║██╔════╝██╔════╝╚══██╔══╝
 ██╔████╔██║█████╗  ███████║██║     ██║     ██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██║        ██║   
 ██║╚██╔╝██║██╔══╝  ██╔══██║██║     ██║     ██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██║        ██║   
 ██║ ╚═╝ ██║███████╗██║  ██║███████╗╚██████╗╚██████╔╝██║ ╚████║██║ ╚████║███████╗╚██████╗   ██║   
 ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═╝   
```
<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)

<br/>

> **Meal Connect** is a full-stack web platform that connects food donors with NGOs and receivers — reducing food waste and fighting hunger through seamless coordination and QR-based verification.

<br/>

</div>

---


## 🌍 Overview

Every day, enormous amounts of food go to waste while millions go hungry. **Meal Connect** solves this by creating a streamlined, role-based platform where:

- 🙋 **Donors** can list surplus food in seconds
- 🏢 **NGOs & Receivers** can discover and claim nearby donations
- 🛡️ **Admins** can monitor, verify, and manage the entire ecosystem

Built with a modern MERN stack, the platform features JWT-secured role-based access, QR-code verification for pickups, and an analytics dashboard for actionable insights.

---

## ✨ Features

<table>
<tr>
<td width="33%" valign="top">

### 👤 Donor
- Register & authenticate securely
- List food donations with details
- Track full donation history
- Dashboard with status updates

</td>
<td width="33%" valign="top">

### 🏢 NGO / Receiver
- Register & get NGO verified
- Browse nearby available donations
- Accept & manage food requests
- **QR-based pickup verification**

</td>
<td width="33%" valign="top">

### 🛠️ Admin
- Manage all users & NGOs
- Monitor platform-wide activity
- Analytics & reporting dashboard
- Content moderation tools

</td>
</tr>
</table>

### 🔧 Platform-Wide
| Feature | Details |
|---|---|
| 🔐 Authentication | JWT-based stateless auth |
| 👥 Role-Based Access | Admin / Donor / NGO with protected routes |
| 📊 Real-Time Dashboards | Live activity monitoring |
| 🔒 Secure API | Middleware-protected, validated endpoints |
| 📱 QR Verification | Scan-to-confirm food pickups |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Context API, Tailwind CSS, MUI Components |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) |
| **Email Service** | Nodemailer |
| **Build Tool** | Vite |

---

## 📁 Project Structure

```
meal-connect/
│
├── Backend/
│   ├── controllers/        # Business logic handlers
│   ├── models/             # Mongoose schemas & models
│   ├── routes/             # Express route definitions
│   ├── middleware/         # Auth guards & validators
│   └── utility/            # Helper scripts (admin/NGO seed)
│
└── Frontend/
    ├── components/         # Reusable UI components
    ├── pages/              # Route-level page components
    ├── context/            # Global state via Context API
    └── services/           # API call abstractions
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/meal-connect.git
cd meal-connect
```

---

### 🔧 Backend Setup

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install
```

Create a `.env` file inside the `Backend/` folder:

```env
MONGO_URL=your_mongodb_connection_string
PORT=3000
EMAIL=your_email@example.com
EMAIL_PASS=your_email_password
JWT_SECRET=your_super_secret_key
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore`.

```bash
# Start the backend server
npm run dev
```

✅ Backend running at: `http://localhost:3000`

---

### 💻 Frontend Setup

```bash
# Navigate to the frontend directory (from root)
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `MONGO_URL` | MongoDB connection URI | `mongodb+srv://...` |
| `PORT` | Backend server port | `3000` |
| `EMAIL` | Sender email for notifications | `noreply@mealconnect.com` |
| `EMAIL_PASS` | Email account password / App password | `••••••••` |
| `JWT_SECRET` | Secret key for JWT signing | `a-long-random-string` |

---

> 🔒 All non-auth routes are protected via JWT middleware.

---

## 🔐 Authentication Flow

```
User registers / logs in
        │
        ▼
  Server validates credentials
        │
        ▼
  JWT issued & stored client-side
        │
        ▼
  Role determined: Admin | Donor | NGO
        │
        ▼
  Protected routes accessible based on role
```

## 🤝 Contributing

Contributions are always welcome! Here's how to get started:

## 👨‍💻 Author

**Vinay Khapare**

---

<div align="center">

**Made with ❤️ to reduce food waste and fight hunger.**

</div>
