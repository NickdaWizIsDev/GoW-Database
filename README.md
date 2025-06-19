# ⚔️ God of War Weapons Database

A basic web application for managing weapons and players inspired by the *God of War* universe. Built with **Node.js**, **MySQL**, and **Vanilla JavaScript**, the app allows creation and display of weapons and players along with detailed stats, images, and interactivity.

---

## 📦 Features

- 🌐 MySQL database initialization via login form  
- 🛠️ Weapon creation with dependencies: sprite, material, skill, type, and level  
- 👤 Player creation with real-time weapon selection  
- 📊 Live display of all players and their weapon stats  
- 🔥 Tooltips show weapon damage, range, and cooldown on hover  
- 🧹 Delete functionality for players  
- 📂 Sprite image handling using static files  

---

## 🖥️ How to Run Locally

### 1. 📥 Clone the repository

```bash
https://github.com/NickdaWizIsDev/GoW-Database
```

### 2. 🛢️ MySQL Setup

Make sure MySQL is running locally. You’ll be asked to enter your MySQL username and password through the login form at runtime.

> The app connects to a database named `gow_weapons`. If it doesn’t exist, it will be created automatically.

### 3. 🏃 Run the server

```bash
cd [your-project-folder]
node server.js
```

### 4. 🌐 Open in Browser

Navigate to:

```
http://localhost:3000
```

Then log in with your MySQL credentials.

---

## 🛠️ Technologies Used

- **Node.js** (Express)  
- **MySQL** (`mysql2` & connection pool)  
- **Bootstrap 5**  
- **Vanilla JavaScript**  
- **HTML/CSS**  

---

## 📌 Notes

- All weapon sprite images are stored under:  
  ```
  /public/assets/sprites
  ```

- Weapon tooltips show damage, range, and cooldown dynamically using Bootstrap.

- Database connection state is saved via `localStorage` after successful login.

---

## 📜 License

This project was created for educational use only.  
© 2025 Nicolás Castro (NickdaWizIsDev) — Joaquín Aravena (Depanamipana). All rights reserved.
