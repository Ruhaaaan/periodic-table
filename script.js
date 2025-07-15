document.addEventListener("DOMContentLoaded", () => {
  fetch("elements.json")
    .then(res => res.json())
    .then(data => {
      const mainTable = document.getElementById("table");
      const lanthanides = document.getElementById("lanthanides");
      const actinides = document.getElementById("actinides");
      const modal = document.getElementById("elementModal");
      const closeBtn = document.querySelector(".close");
      const themeToggle = document.getElementById("themeToggle");

      // Add group numbers 1–18
// Group numbers
const groupRow = document.querySelector(".group-numbers");
groupRow.innerHTML = '<div></div>'; // Spacer for alignment
for (let i = 1; i <= 18; i++) {
  const label = document.createElement("div");
  label.textContent = i;
  groupRow.appendChild(label);
}

// Render period numbers
const periodCol = document.querySelector(".period-numbers");
for (let i = 1; i <= 7; i++) {
  const label = document.createElement("div");
  label.textContent = i;
  periodCol.appendChild(label);
}



      // Toggle dark mode
      themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        themeToggle.textContent = document.body.classList.contains("dark")
          ? "☀️ Light Mode"
          : "🌙 Dark Mode";
      });

      // Render elements
      data.forEach(el => {
        const elementDiv = document.createElement("div");
        elementDiv.classList.add("element");
        elementDiv.setAttribute("data-category", el.category);
        elementDiv.style.gridColumnStart = el.group;
        elementDiv.style.gridRowStart = el.period;
        
        elementDiv.innerHTML = `
          <span class="number">${el.atomicNumber}</span>
          <span class="symbol">${el.symbol}</span>
        `;

        // Place in correct section
        if (el.category === "lanthanide") {
            lanthanides.appendChild(elementDiv);
        } else if (el.category === "actinide") {
            actinides.appendChild(elementDiv);
        } else {
            mainTable.appendChild(elementDiv);
            }

        // Open modal on click
        elementDiv.addEventListener("click", () => {
          document.getElementById("modal-name").textContent = el.name;
          document.getElementById("modal-symbol").textContent = el.symbol;
          document.getElementById("modal-number").textContent = el.atomicNumber;
          document.getElementById("modal-mass").textContent = el.atomicMass;
          document.getElementById("modal-category").textContent = el.category;
          document.getElementById("modal-group").textContent = el.group;
          document.getElementById("modal-period").textContent = el.period;
          modal.style.display = "block";
        });
      });

      // Filter + hover focus
      document.querySelectorAll(".filters button").forEach(btn => {

        // Hover focus effect
        btn.addEventListener("mouseenter", () => {
          const type = btn.getAttribute("data-filter");
          document.querySelectorAll(".element").forEach(el => {
            const category = el.getAttribute("data-category");
            if (type === "all" || category === type) {
              el.classList.remove("dimmed");
            } else {
              el.classList.add("dimmed");
            }
          });
        });

        btn.addEventListener("mouseleave", () => {
          document.querySelectorAll(".element").forEach(el => {
            el.classList.remove("dimmed");
          });
        });
      });

      // Close modal
      closeBtn.onclick = () => {
        modal.style.display = "none";
      };

      window.onclick = event => {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      };
    });
});

// 🔍 Search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase();
  document.querySelectorAll(".element").forEach(el => {
    const symbol = el.querySelector(".symbol").textContent.toLowerCase();
    const number = el.querySelector(".number").textContent;
    const name = el.querySelector(".name")?.textContent.toLowerCase() || '';
    if (
      symbol.includes(search) ||
      name.includes(search) ||
      number.includes(search)
    ) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
});

// 🌡 Heatmap by atomic number (you can change to atomicMass later)
const heatmapToggle = document.getElementById("heatmapToggle");
let heatmapActive = false;

heatmapToggle.addEventListener("click", () => {
  heatmapActive = !heatmapActive;
  document.querySelectorAll(".element").forEach(el => {
    const num = parseFloat(el.querySelector(".number").textContent);
    const normalized = num / 118;
    const intensity = Math.floor(normalized * 255);
    const bgColor = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    el.style.backgroundColor = heatmapActive ? bgColor : "";
    el.classList.toggle("heatmap", heatmapActive);
  });
});
