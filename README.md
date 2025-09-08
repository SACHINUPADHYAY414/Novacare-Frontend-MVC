
# 📋 NOVACARE FRONTEND REACT PROJECT

A **responsive, intuitive, and secure healthcare management frontend** built with **React**, integrating **JWT authentication**, **Redux state management**, **persisted storage**, and modern UI components. Designed to complement the Novacare Backend for seamless healthcare operations.

---

## 📚 Table of Contents

- [✨ Features](#✨features)
- [🛠 Tech Stack & Dependencies](#🛠-tech-stack--dependencies)
- [🏗 Architecture](#🏗-architecture)
- [🔐 Authentication & State Management](#🔐-authentication--state-management)
- [🎨 UI & User Experience](#🎨-ui--user-experience)
- [🚀 Getting Started](#🚀-getting-started)
- [⚙ Environment Variables / Configuration](#⚙-environment-variables--configuration)
- [🧪 Testing & Debugging](#🧪-testing--debugging)
- [🤝 Contributing](#🤝-contributing)
- [📞 Contact](#📞-contact)
- [📄 License](#📄-license)

---

## ✨ Features

✅ **JWT-based Authentication & Authorization** integrated with backend  
✅ **Two-Factor Authentication (2FA)** workflow UI with OTP inputs  
✅ **Role-Based Access Control** for Admin, Internal Users, and Clients  
✅ **Doctor Management UI:**  
  - Create, Edit, Inactivate doctors  
  - Upload and view doctor's profile images  
✅ **Specialization Management UI:**  
  - Create, Edit, Delete specializations  
✅ **Internal User & Patient Management:**  
  - Add internal users and patients with full validation  
✅ **Duty Roster Scheduling:**  
  - Create schedules with available slots and timings  
✅ **Form Validations:**  
  - Real-time validation with visual feedback  
✅ **Notification System:**  
  - Toast notifications via `react-hot-toast`  
  - Tooltip helpers via `react-bootstrap` and `primereact`  
✅ **State Management:**  
  - Redux Toolkit for global state  
  - Redux Persist for session storage  
✅ **API Integration:**  
  - Axios for server communication  
✅ **Date Handling:**  
  - React Datepicker for scheduling and records  
✅ **UI Enhancements:**  
  - Icons from FontAwesome and React Icons  
  - Emoji support with `emoji-picker-react`  
✅ **User Feedback:**  
  - Alerts and modals using `sweetalert2` and `sweetalert2-react-content`  
✅ **Responsive Layouts:**  
  - Bootstrap and RSuite for styling components  
✅ **Error Handling:**  
  - Form errors, validation, and network issues are managed gracefully

---

## 🛠 Tech Stack & Dependencies

### Frameworks & Libraries

- **React 19.x** – Frontend library for component-driven UI  
- **React Router DOM 7.x** – Client-side routing  
- **React Redux 9.x** – Global state management  
- **Redux Persist 6.x** – Persisted state storage  
- **Axios 1.x** – HTTP client  
- **Bootstrap 5.x / React Bootstrap 2.x** – Responsive UI styling  
- **PrimeReact 10.x** – Rich UI components  
- **RSuite 5.x** – Advanced UI elements  
- **React Datepicker 8.x** – Date picking functionality  
- **React Hot Toast 2.x** – Notifications system  
- **FontAwesome & React Icons** – Iconography support  
- **Emoji Picker React 4.x** – Emoji input fields  
- **SweetAlert2 11.x & React Content 5.x** – Modals and alerts  
- **Lodash & Utility Libraries** – Utility functions

### Development Tools

- **npm 11.x** – Package management  
- **Install 0.13.x** – Dependency management  
- **ESLint / Prettier** – Code formatting  
- **Jest / React Testing Library** (optional) – Testing framework  

---

## 🏗 Architecture

```
Components <-> Redux State <-> Axios API Calls <-> Backend
```

- Modular structure with reusable components  
- State persisted across sessions using Redux Persist  
- Secure JWT storage with automatic token refresh (optional)  
- Controlled forms with validation rules for user feedback  
- Routing handled with React Router for seamless navigation  

---

## 🔐 Authentication & State Management

1. **Login Flow:**
   - User submits credentials via form.
   - Axios requests backend for validation.
   - OTP screen is displayed for Two-Factor Authentication.
   - After verification, JWT token is stored using Redux and Persist.

2. **Authorization Flow:**
   - Protected routes restrict access based on user role.
   - Token is appended to each API request header.

3. **State Handling:**
   - Global state using Redux Toolkit slices.
   - Session persistence via `redux-persist` across browser reloads.

---

## 🎨 UI & User Experience

- Fully responsive interfaces using Bootstrap and RSuite  
- Accessible forms with tooltips explaining each field  
- Interactive buttons, icons, and alerts improving engagement  
- Real-time form validation preventing incomplete or incorrect submissions  
- Date selection, emoji inputs, and file uploads enhancing workflows  
- Smooth navigation with React Router  
- Notifications for success, warning, or errors via toast popups

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js 18.x or higher  
- npm 11.x or higher  
- Backend API running and accessible  

### ✅ Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SACHINUPADHYAY414/Novacare-Frontend.git
   cd Novacare-Frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory with:

   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_JWT_SECRET=your_jwt_secret
   REACT_APP_ALLOWED_ORIGINS=http://localhost:3000
   ```

4. **Start the application:**

   ```bash
   npm start
   ```

5. **Access the application:**

   Open your browser and go to `http://localhost:3000`

---

## ⚙ Environment Variables / Configuration

| Variable                | Description            |
|------------------------|-----------------------|
| `REACT_APP_API_URL`    | Backend API endpoint  |
| `REACT_APP_JWT_SECRET` | JWT encryption key   |
| `REACT_APP_ALLOWED_ORIGINS` | Frontend allowed domains |

---

## 🧪 Testing & Debugging

- Use `npm run test` to execute tests  
- Validate forms using built-in validation schemas  
- Use browser developer tools to inspect state and requests  
- Check console logs for warnings and errors

---

## 🤝 Contributing

Contributions are always welcome! Please:

1. Fork the repository  
2. Create a feature branch  
3. Implement and test your changes  
4. Submit a pull request with descriptions  
5. Ensure your code passes validations and tests

---

## 📞 Contact

**Sachin Upadhyay**  
📧 Email: upadhyaysachin@gmail.com  
📱 Contact: +91 7294890821

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using **React**, **Redux**, and **JWT** to empower secure healthcare management workflows.
