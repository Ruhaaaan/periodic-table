# 🌐 Interactive Periodic Table

A visually interactive and responsive periodic table web app built with HTML, CSS, and JavaScript. This table allows users to explore all 118 elements, filter by category, view group/period alignments, and toggle between light/dark themes.

---

## 🚀 Features

- 🎨 **Category-Based Color Coding** – Each element is styled according to its chemical group.
- 🔍 **Search Functionality** – Instantly search elements by name, symbol, or atomic number.
- 🌗 **Light/Dark Mode** – Toggle between clean light and elegant dark themes.
- 🌡 **Atomic Mass Heatmap** – Optional heatmap visualization based on atomic number.
- 🧪 **Modal Info Popups** – Click an element to view detailed information in a modal.
- 📊 **Group & Period Numbers** – Clear labeling for educational clarity.
- 🧬 **Lanthanide & Actinide Alignment** – f-block elements properly positioned under Group 3 with connecting lines.

---

## 📂 File Structure


📁 root
├── index.html # Main HTML page
├── style.css # Styling for layout, categories, themes
├── script.js # Handles rendering, modal, filtering
├── elements.json # JSON data for all periodic elements
├── elements.js #Handles rendering, modal
├── elements.css # Element Page Styling for layout, categories, themes
├── elements.html # Main Element HTML page
└── README.md # Project overview





## 🧠 How It Works

- Elements are rendered from `elements.json` using JavaScript.
- Each element is placed on the grid using its `group` and `period` values.
- Lanthanides and actinides are rendered separately but visually linked via lines and placement.
- Filters dim irrelevant elements to highlight selected categories.

---

## 🛠 Tech Stack

- **HTML5**
- **CSS Grid + Flexbox**
- **Vanilla JavaScript**

---

## 📸 Live Demo


👉 View Live on Vercel
https://periodictable-byms8w9u6-ruhaaaans-projects.vercel.app/

🧾 License
This project is licensed under the MIT License.

👤 Author
Ruhaan Reyaz
