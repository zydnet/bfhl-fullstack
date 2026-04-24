# BFHL Full Stack Assignment : Devanshi Agrawal

This project is a solution to the **SRM Full Stack Engineering Challenge (Round 1)** conducted by Bajaj Finserv Health Limited.

---

## 🚀 Live Demo

- Frontend: https://bfhl-fullstack-navy.vercel.app/
- Backend API: https://bfhl-api-gkbz.onrender.com

---

## 🧠 Overview

The application processes node relationships (e.g. `A->B`) to:

- Build hierarchical trees  
- Detect cycles  
- Identify invalid inputs  
- Track duplicate edges  
- Generate structured insights  

---

## 📸 Screenshots

### 🔹 Input & Analysis

<p align="center">
  <img src="https://github.com/user-attachments/assets/dcd1f7f8-a21f-4a37-8e2f-5d08d2bffc51" width="700"/>
</p>

---

### 🔹 Tree Visualization

| Tree View 1 | Tree View 2 |
|------------|------------|
| <img src="https://github.com/user-attachments/assets/2ee7113a-6bcb-4447-8754-292ba279a189" width="100%"> | <img src="https://github.com/user-attachments/assets/902facbe-3e84-4e7d-831d-0e01c70830f3" width="100%"> |

---

## ⚙️ Tech Stack

- Node.js, Express  
- React (Vite)  
- Render & Vercel  

---

## 📡 API

**POST /bfhl**

Example:
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
