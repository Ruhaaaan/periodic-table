// script.js



document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("table");
  const lanthanides = document.getElementById("lanthanides");
  const actinides = document.getElementById("actinides");
  const modal = document.getElementById("elementModal");
  const closeBtn = document.querySelector(".close");
  const themeToggle = document.getElementById("themeToggle");
  const moonIcon = document.getElementById("moonIcon");
  const sunIcon = document.getElementById("sunIcon");
  const heatmapToggle = document.getElementById("heatmapToggle");
  const searchToggle = document.getElementById("searchToggle");
  const searchInput = document.getElementById("searchInput");
  const largeInfoCard = document.getElementById("hover-large-info");
  const body = document.body;

  let heatmapActive = false;

  const updateThemeIcon = () => {
    const isDark = body.classList.contains("dark");
    sunIcon.style.display = isDark ? "" : "none";
    moonIcon.style.display = isDark ? "none" : "";
  };

  const isVisible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

  const groupRow = document.querySelector(".group-numbers");
  groupRow.innerHTML = '<div></div>'; // Spacer
  for (let i = 1; i <= 18; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    groupRow.appendChild(div);
  }

  const periodCol = document.querySelector(".period-numbers");
  for (let i = 1; i <= 7; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    periodCol.appendChild(div);
  }

  fetch("elements.json")
    .then(res => res.json())
    .then(data => {
      data.elements.forEach(el => {
        const elementDiv = document.createElement("div");
        elementDiv.classList.add("element");
        elementDiv.dataset.category = el.category;
        elementDiv.dataset.group = el.group;
        elementDiv.dataset.period = el.period;
        elementDiv.dataset.symbol = el.symbol;
        elementDiv.dataset.number = el.number;
        elementDiv.dataset.name = el.name;
        elementDiv.dataset.atomic_mass = el.atomic_mass;
        elementDiv.dataset.discovered_by = el.discovered_by || "Unknown";
        elementDiv.dataset.shells = el.shells?.join(', ') || "N/A";
        elementDiv.dataset.electron_configuration = el.electron_configuration || "N/A";

        elementDiv.innerHTML = `
          <span class="number">${el.number}</span>
          <span class="symbol">${el.symbol}</span>
        `;

        elementDiv.style.gridColumnStart = el.group;
        elementDiv.style.gridRowStart = el.period;

        if (el.category === "lanthanide") {
          lanthanides.appendChild(elementDiv);
        } else if (el.category === "actinide") {
          actinides.appendChild(elementDiv);
        } else {
          table.appendChild(elementDiv);
        }

        elementDiv.addEventListener("click", () => {
          window.location.href = `element.html?atomicNumber=${el.number}`;
        });

        elementDiv.addEventListener("mouseenter", () => {
          
          
          largeInfoCard.querySelector(".info-card-symbol").textContent = el.symbol;
          largeInfoCard.querySelector(".info-title").textContent = el.name;
          largeInfoCard.querySelectorAll(".info-item")[0].textContent = `Discovered: ${el.discovered_by || "Unknown"}`;
          largeInfoCard.querySelectorAll(".info-item")[1].textContent = `Atomic Mass: ${el.atomic_mass}`;
          largeInfoCard.querySelectorAll(".info-item")[2].textContent = `Electron Shells: ${el.shells?.join(', ') || "N/A"}`;
          largeInfoCard.querySelectorAll(".info-item")[3].textContent = `Config: ${el.electron_configuration || "N/A"}`;
          
          const bgColor = categoryColors[el.category] || "#ddd";
          largeInfoCard.style.backgroundColor = bgColor;
          
          largeInfoCard.style.display = "block";
          largeInfoCard.style.top = "200px";
          largeInfoCard.style.left = "50%";
          largeInfoCard.style.transform = "translateX(-50%)";
        });

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

        elementDiv.addEventListener("mouseleave", () => {
          largeInfoCard.style.display = "none";
        });
      });

      addGroupPeriodHover();
    });

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    updateThemeIcon();
  });
  updateThemeIcon();

  


  heatmapToggle.addEventListener("click", () => {
    heatmapActive = !heatmapActive;
    body.classList.toggle("heatmap-active", heatmapActive);
    document.querySelectorAll(".element").forEach(el => {
      const num = parseInt(el.dataset.number);
      const normalized = num / 118;
      const intensity = Math.floor(normalized * 255);
      el.style.backgroundColor = heatmapActive
        ? `rgb(255, ${255 - intensity}, ${255 - intensity})`
        : "";
    });
  });

  searchToggle.addEventListener("mouseenter", () => {
    setTimeout(() => {
      if (!searchInput.disabled && isVisible(searchInput)) {
        searchInput.focus();
      }
    }, 200);
  });

  searchToggle.addEventListener("click", () => {
    if (!searchInput.disabled && isVisible(searchInput)) {
      searchInput.focus();
    }
  });

  searchToggle.addEventListener("mouseleave", () => {
    if (document.activeElement === searchInput) {
      searchInput.blur();
    }
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".element").forEach(el => {
      const symbol = el.dataset.symbol.toLowerCase();
      const name = el.dataset.name?.toLowerCase();
      const number = el.dataset.number;
      const match = symbol.includes(query) || name.includes(query) || number === query;
      el.style.display = match ? "flex" : "none";
    });
  });
});

function addGroupPeriodHover() {
  const elements = document.querySelectorAll(".element");
  const groupLabels = document.querySelectorAll(".group-numbers div:not(:first-child)");
  const periodLabels = document.querySelectorAll(".period-numbers div");

  groupLabels.forEach((label, idx) => {
    const group = idx + 1;
    label.addEventListener("mouseenter", () => {
      elements.forEach(el => {
        el.classList.toggle("focused", el.dataset.group == group);
        el.classList.toggle("blurred", el.dataset.group != group);
      });
    });
    label.addEventListener("mouseleave", () => {
      elements.forEach(el => {
        el.classList.remove("focused", "blurred");
      });
    });
  });

  periodLabels.forEach((label, idx) => {
    const period = idx + 1;
    label.addEventListener("mouseenter", () => {
      elements.forEach(el => {
        el.classList.toggle("focused", el.dataset.period == period);
        el.classList.toggle("blurred", el.dataset.period != period);
      });
    });
    label.addEventListener("mouseleave", () => {
      elements.forEach(el => {
        el.classList.remove("focused", "blurred");
      });
    });
  });
}



