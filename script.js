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
      const body = document.body;
      const moonIcon = document.getElementById("moonIcon");
      const sunIcon = document.getElementById("sunIcon");

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
      // Set initial icon based on theme
function updateThemeIcon() {
  if (body.classList.contains("dark")) {
    sunIcon.style.display = "";
    moonIcon.style.display = "none";
  } else {
    sunIcon.style.display = "none";
    moonIcon.style.display = "";
  }
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  updateThemeIcon();
});

// Set icon on load
updateThemeIcon();

      // Render elements
      data.forEach(el => {
        const elementDiv = document.createElement("div");
        elementDiv.classList.add("element");
        elementDiv.setAttribute("data-category", el.category);
        elementDiv.setAttribute("data-group", el.group);     // <-- ADD THIS
        elementDiv.setAttribute("data-period", el.period);   // <-- ADD THIS
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
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const cat = btn.getAttribute('data-filter');
    document.querySelectorAll('.element').forEach(el => {
      if (cat === 'all' || el.dataset.category === cat) {
        el.classList.add('focused');
        el.classList.remove('blurred');
      } else {
        el.classList.remove('focused');
        el.classList.add('blurred');
      }
    });
  });
  btn.addEventListener('mouseleave', () => {
    document.querySelectorAll('.element').forEach(el => {
      el.classList.remove('focused', 'blurred');
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

      // After rendering elements, add:
function setupFocusBlur() {
  const groupNumbers = document.querySelectorAll('.group-numbers div');
  const periodNumbers = document.querySelectorAll('.period-numbers div');
  const allElements = document.querySelectorAll('.element');

  // Group hover
  groupNumbers.forEach((groupDiv, idx) => {
    if (idx === 0) return; // skip spacer
    groupDiv.addEventListener('mouseenter', () => {
      const group = idx;
      let found = false;
      allElements.forEach(el => {
        if (parseInt(el.dataset.group) === group) found = true;
      });
      if (!found) return; // don't blur if no match
      allElements.forEach(el => {
        if (parseInt(el.dataset.group) === group) {
          el.classList.add('focused');
          el.classList.remove('blurred');
        } else {
          el.classList.add('blurred');
          el.classList.remove('focused');
        }
      });
    });
    groupDiv.addEventListener('mouseleave', () => {
      allElements.forEach(el => {
        el.classList.remove('focused', 'blurred');
      });
    });
  });

  // Period hover
  periodNumbers.forEach((periodDiv, idx) => {
    const period = idx + 1;
    let found = false;
    periodDiv.addEventListener('mouseenter', () => {
      allElements.forEach(el => {
        if (parseInt(el.dataset.period) === period) found = true;
      });
      if (!found) return;
      allElements.forEach(el => {
        if (parseInt(el.dataset.period) === period) {
          el.classList.add('focused');
          el.classList.remove('blurred');
        } else {
          el.classList.add('blurred');
          el.classList.remove('focused');
        }
      });
    });
    periodDiv.addEventListener('mouseleave', () => {
      allElements.forEach(el => {
        el.classList.remove('focused', 'blurred');
      });
    });
  });
}

  // Call this after you render all elements
  setupFocusBlur();

    });
});

// 🌡 Heatmap by atomic number (you can change to atomicMass later)
const heatmapToggle = document.getElementById("heatmapToggle");
const body = document.body;

let heatmapActive = false;

heatmapToggle.addEventListener("click", () => {
  heatmapActive = !heatmapActive;
  body.classList.toggle("heatmap-active", heatmapActive);
  document.querySelectorAll(".element").forEach(el => {
    const num = parseFloat(el.querySelector(".number").textContent);
    const normalized = num / 118;
    const intensity = Math.floor(normalized * 255);
    const bgColor = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    el.style.backgroundColor = heatmapActive ? bgColor : "";
    el.classList.toggle("heatmap", heatmapActive);
  });
});

  const searchToggle = document.getElementById("searchToggle");
  const searchInput = document.getElementById("searchInput");

  // Focus input when hovering or clicking the search area
  document.querySelector('.top-left-search').addEventListener('mouseenter', () => {
    setTimeout(() => searchInput.focus(), 200);
  });

  // (Optional) Add your search logic here
  // searchInput.addEventListener('input', (e) => { ... });

