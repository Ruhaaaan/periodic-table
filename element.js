document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const moonIcon = document.getElementById("moonIcon");
  const sunIcon = document.getElementById("sunIcon");
  
  const urlParams = new URLSearchParams(window.location.search);
  const atomicNumber = parseInt(urlParams.get("atomicNumber"));


  // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }

    const updateIcons = () => {
      const isDark = body.classList.contains("dark");
      sunIcon.style.display = isDark ? "block" : "none";
      moonIcon.style.display = isDark ? "none" : "block";
    };

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
      updateIcons();
    });

    updateIcons();

  fetch("elements.json")
    .then(res => res.json())
    .then(data => {
      const element = data.elements.find(el => el.number === atomicNumber);
      if (!element) {
        document.getElementById("element-info").innerHTML = "<p>Element not found.</p>";
        return;
      }

      const container = document.createElement("div");
      container.className = "container";

      

container.innerHTML = `
  <div class="card">
    <div class="element-header">
      <div class="element-symbol category-${element.category.replace(/\s+/g, '-').toLowerCase()}">${element.symbol}</div>
      <div>
        <div class="element-name">${element.name}</div>
        <div class="atomic-number">Atomic Number: ${element.number}</div>
      </div>
    </div>
    <div class="category-color category-${element.category.replace(/\s+/g, '-').toLowerCase()}">
      Category: ${element.category}
    </div>
    <p>${element.summary || "No description available."}</p>
     <p>${element.bohr_model_image ? `<img src="${element.bohr_model_image}" alt="Bohr model" class="element-image-modal">` : ''}</p>
     <p>${element.image?.url ? `<img src="${element.image.url}" alt="${element.image.title}" class="element-image">` : ''}</p>

  </div>

  <div class="card">
    <h3>Properties</h3>
    <table class="property-table">
      <tr><th>Symbol</th><td>${element.symbol}</td></tr>
      <tr><th>Atomic Number</th><td>${element.number}</td></tr>
      <tr><th>Atomic Mass</th><td>${element.atomic_mass || "N/A"} u</td></tr>
      <tr><th>Boiling Point</th><td>${element.boil ?? "Unknown"} K</td></tr>
      <tr><th>Melting Point</th><td>${element.melt ?? "Unknown"} K</td></tr>
      <tr><th>Density</th><td>${element.density ?? "Unknown"} g/cm³</td></tr>
      <tr><th>Phase</th><td>${element.phase ?? "Unknown"}</td></tr>
      <tr><th>Electron Configuration</th><td>${element.electron_configuration || "N/A"}</td></tr>
      <tr><th>Electronegativity</th><td>${element.electronegativity_pauling ?? "N/A"}</td></tr>
      <tr><th>Ionization Energy</th><td>${element.ionization_energies?.[0] || "N/A"} kJ/mol</td></tr>
      <tr><th>Discovered By</th><td>${element.discovered_by || "Unknown"}</td></tr>
      <tr><th>Named By</th><td>${element.named_by || "Unknown"}</td></tr>
      <tr><th>Shells</th><td>${element.shells?.join(", ") || "Unknown"}</td></tr>
      <tr><th>Orbital Subshells</th><td>${element.electron_configuration_semantic || "N/A"}</td></tr>
    </table>
  </div>

  <div class="card">
    <h3>
      Bohr Model
      <select id="bohr-mode-toggle" style="float: right; font-size: 0.9rem;">
        <option value="svg">Animated</option>
        <option value="static">Static</option>
      </select>
    </h3>
    <div id="bohr-model" style="width: 300px; height: 300px; position: relative; margin: auto;"></div>
  </div>
`;

      document.getElementById("element-info").appendChild(container);

      // Default render as SVG
      renderBohrModelSVG(element.shells || []);

      // Toggle listener
      let lastStaticAngles = null;

document.getElementById("bohr-mode-toggle").addEventListener("change", (e) => {
  const mode = e.target.value;
  if (mode === "svg") {
    renderBohrModelSVG(element.shells || [], lastStaticAngles);
  } else {
    lastStaticAngles = renderBohrModelStatic(element.shells || []);
  }
});
    })
    .catch(err => {
      console.error("Failed to load element data:", err);
      document.getElementById("element-info").innerHTML = "<p>Error loading data.</p>";
    });
});

function renderBohrModelStatic(shells) {
  const container = document.getElementById("bohr-model");
  container.innerHTML = "";

  const center = document.createElement("div");
  center.style.width = "12px";
  center.style.height = "12px";
  center.style.background = "black";
  center.style.borderRadius = "50%";
  center.style.position = "absolute";
  center.style.top = "50%";
  center.style.left = "50%";
  center.style.transform = "translate(-50%, -50%)";
  container.appendChild(center);

  const radiusStep = 20;
  const angles = [];

  shells.forEach((count, index) => {
    const radius = (index + 1) * radiusStep;
    const orbit = document.createElement("div");
    orbit.className = "orbit";
    orbit.style.width = `${radius * 2}px`;
    orbit.style.height = `${radius * 2}px`;
    orbit.style.position = "absolute";
    orbit.style.border = "1px dashed #888";
    orbit.style.borderRadius = "50%";
    orbit.style.top = `${150 - radius}px`;
    orbit.style.left = `${150 - radius}px`;

    const shellAngles = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const electron = document.createElement("div");
      electron.className = "electron";
      electron.style.position = "absolute";
      electron.style.width = "8px";
      electron.style.height = "8px";
      electron.style.backgroundColor = "cyan";
      electron.style.borderRadius = "50%";
      electron.style.top = `${radius + y - 4}px`;
      electron.style.left = `${radius + x - 4}px`;

      orbit.appendChild(electron);

      // Save angle in degrees
      shellAngles.push((angle * 180) / Math.PI);
    }

    angles.push(shellAngles);
    container.appendChild(orbit);
  });

  return angles; // new line
}


function renderBohrModelSVG(shells, angles = null) {
  const container = document.getElementById("bohr-model");
  container.innerHTML = "";

  const svgNS = "http://www.w3.org/2000/svg";
  const size = 200;
  const center = size / 2;
  const radiusStep = 20;

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.style.display = "block";
  svg.style.margin = "0 auto";

  const nucleus = document.createElementNS(svgNS, "circle");
  nucleus.setAttribute("cx", center);
  nucleus.setAttribute("cy", center);
  nucleus.setAttribute("r", 10);
  nucleus.setAttribute("fill", "#222");
  svg.appendChild(nucleus);

  shells.forEach((count, index) => {
    const orbitRadius = (index + 1) * radiusStep;

    const orbit = document.createElementNS(svgNS, "circle");
    orbit.setAttribute("cx", center);
    orbit.setAttribute("cy", center);
    orbit.setAttribute("r", orbitRadius);
    orbit.setAttribute("fill", "none");
    orbit.setAttribute("stroke", "#888");
    orbit.setAttribute("stroke-dasharray", "4,4");
    svg.appendChild(orbit);

    for (let i = 0; i < count; i++) {
      const initialAngle =
        angles?.[index]?.[i] ?? Math.random() * 360; // use static angle if provided
      const duration = (Math.random() * 6 + 4).toFixed(2);
      const direction = Math.random() > 0.5 ? 1 : -1;

      const group = document.createElementNS(svgNS, "g");
      group.setAttribute("transform", `rotate(${initialAngle} ${center} ${center})`);

      const electron = document.createElementNS(svgNS, "circle");
      electron.setAttribute("cx", center + orbitRadius);
      electron.setAttribute("cy", center);
      electron.setAttribute("r", 5);
      electron.setAttribute("fill", "cyan");

      const animate = document.createElementNS(svgNS, "animateTransform");
      animate.setAttribute("attributeName", "transform");
      animate.setAttribute("attributeType", "XML");
      animate.setAttribute("type", "rotate");
      animate.setAttribute("from", `0 ${center} ${center}`);
      animate.setAttribute("to", `${direction * 360} ${center} ${center}`);
      animate.setAttribute("dur", `${duration}s`);
      animate.setAttribute("repeatCount", "indefinite");

      group.appendChild(electron);
      group.appendChild(animate);
      svg.appendChild(group);
    }
  });

  container.appendChild(svg);
}



  




 







