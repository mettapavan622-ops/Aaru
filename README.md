# AARU — The Sixth Element of a Woman

> **Clothing that becomes an invisible force — completing her with intuition, softness, power, confidence, strength, and protection.**

AARU is a modern fashion e-commerce platform built for **AARU by Moni**, designed around the idea that clothing is more than something a woman wears — it is something that moves with her, belongs to her, and elevates her.

## ✨ About AARU

Nature gives us five elements:

**Earth • Water • Fire • Air • Sky**

AARU represents the **sixth element — Intuition.**

It represents the invisible qualities that define a woman:

* Intuition
* Softness
* Power
* Confidence
* Strength
* Protection

At AARU, every piece is designed to become part of her journey.

> **"Every piece is created to move with you, belong to you, and elevate you."**

---

## 🚀 Features

### 🛍️ User Frontend

* Modern fashion-focused UI
* Product browsing and discovery
* Product details
* Product categories
* Shopping cart
* User authentication
* OTP / email-based authentication
* Responsive design
* Order management
* Secure checkout
* Razorpay payment integration

### 🔐 Authentication

* User registration and login
* OTP-based verification
* Email authentication
* Secure session handling
* JWT-based authentication
* Protected routes

### 👩‍💼 Admin Dashboard

Separate admin functionality for managing the e-commerce platform.

* Admin authentication
* Dashboard overview
* Product management
* Order management
* User management
* Inventory management
* Content management
* Admin-protected routes

### 💳 Payments

Integrated with **Razorpay** for online payments.

The application supports Razorpay's testing environment during development.

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* TypeScript / JavaScript
* Vite
* Tailwind CSS
* Responsive UI

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* PostgreSQL

### Authentication

* OTP / Email Authentication
* JWT
* Secure password handling

### Payments

* Razorpay

### Deployment

* Render

### Development Tools

* Git
* GitHub
* VS Code
* AI-assisted development

---

## 🏗️ Project Architecture

```text
AARU
│
├── Frontend
│   ├── User Website
│   ├── Authentication
│   ├── Products
│   ├── Cart
│   ├── Checkout
│   └── Orders
│
├── Admin Dashboard
│   ├── Dashboard
│   ├── Products
│   ├── Orders
│   ├── Users
│   └── Inventory
│
├── Backend
│   ├── Authentication APIs
│   ├── Product APIs
│   ├── Order APIs
│   ├── User APIs
│   └── Payment APIs
│
└── Database
    └── PostgreSQL
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mettapavan622-ops/Aaru.git
```

### 2. Navigate into the project

```bash
cd Aaru
```

### 3. Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### 4. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
PORT=10000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_test_secret

BREVO_API_KEY=your_brevo_api_key
```

> Never commit your `.env` file or expose API keys and secrets publicly.

### 5. Start the development server

```bash
npm run dev
```

Or:

```bash
bun run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable              | Purpose                        |
| --------------------- | ------------------------------ |
| `PORT`                | Backend server port            |
| `DATABASE_URL`        | PostgreSQL database connection |
| `JWT_SECRET`          | JWT authentication secret      |
| `FRONTEND_URL`        | Frontend application URL       |
| `RAZORPAY_KEY_ID`     | Razorpay API key               |
| `RAZORPAY_KEY_SECRET` | Razorpay secret                |
| `BREVO_API_KEY`       | Email/OTP service API key      |

---

## 💳 Razorpay Integration

AARU uses Razorpay for online payment processing.

During development, Razorpay **Test Mode** should be used.

For production deployment, production credentials should be stored securely as environment variables.

---

## 🛡️ Security

AARU follows several security practices including:

* JWT-based authentication
* Protected admin routes
* Environment-based secrets
* Server-side API validation
* Secure payment processing
* Role-based access control
* Separation of user and admin functionality

**Never commit API keys, database credentials, JWT secrets, or other sensitive credentials to GitHub.**

---

## 📱 Responsive Design

AARU is designed to work across:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

The interface adapts to different screen sizes while maintaining a clean fashion-focused experience.

---

## 🌐 Deployment

The application can be deployed using **Render**.

Typical deployment flow:

```text
GitHub
   ↓
Render
   ↓
Node.js Backend
   ↓
PostgreSQL Database
```

Environment variables should be configured through the deployment platform rather than committed to the repository.

---

## 🔮 Future Improvements

Potential future enhancements include:

* Wishlist functionality
* Product reviews and ratings
* Advanced product filtering
* AI-powered fashion recommendations
* Personalized shopping experience
* Coupon and discount management
* Advanced analytics dashboard
* Inventory alerts
* Multiple payment methods
* Order tracking
* Social media integration

---

## 👩‍🎨 Brand

**AARU by Moni**

A fashion brand built around the belief that clothing can become an extension of a woman's identity, confidence, and strength.

> **The Sixth Element of a Woman.**

---

## 👨‍💻 Developers

**Sri Harshini,Metta Pavan**

Computer Science Engineering
AI & Full-Stack Development

GitHub: [msriharshini64-lgtm](https://github.com/msriharshini64-lgtm)
GitHub: [mettapavan622-ops](https://github.com/mettapavan622-ops)
---

## 📄 License

This project is developed for AARU.

All brand assets, designs, product images, logos, and related content belong to their respective owners.
