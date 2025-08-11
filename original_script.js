// 🌌 Create twinkling stars
function createStars() {
  const starsContainer = document.querySelector('.stars');
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    starsContainer.appendChild(star);
  }
}

// 📜 Animate steps when they scroll into view
function animateStepsOnScroll() {
  document.querySelectorAll('.step').forEach(step => {
    const position = step.getBoundingClientRect();
    if (position.top < window.innerHeight && position.bottom > 0) {
      step.style.opacity = '1';
      step.style.transform = 'translateY(0)';
    }
  });
}

// 🧠 Global tracker
let selectedComponents = {};

// 🔄 Load saved build from localStorage
function loadSavedBuild() {
  const saved = localStorage.getItem("pcBuild");
  if (!saved) return;

  try {
    selectedComponents = JSON.parse(saved);

    for (let componentType in selectedComponents) {
      const { name } = selectedComponents[componentType];
      const step = document.querySelector(`.step[data-component="${componentType}"]`);
      if (!step) continue;

      const options = step.querySelectorAll(".component-option");
      options.forEach(option => {
        if (option.getAttribute("data-name") === name) {
          option.classList.add("selected");
        }
      });
    }

    updateSummary();
    updateProgress();
    updatePerformanceEstimate();
    checkCompatibility();
    animateStepsOnScroll(); // 👈 Ensure steps are visible after loading
  } catch (e) {
    console.error("Error loading saved build:", e);
  }
}

// 🚀 Initialize page
function initializePage() {
  createStars();

  document.querySelectorAll('.step').forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  setTimeout(animateStepsOnScroll, 100);
  loadSavedBuild();
}

// 🖱 Handle component selection
function setupComponentSelection() {
  document.querySelectorAll(".step").forEach(step => {
    const componentType = step.getAttribute("data-component");
    const componentOptions = step.querySelectorAll(".component-option");

    componentOptions.forEach(option => {
      option.addEventListener("click", function () {
        componentOptions.forEach(opt => opt.classList.remove("selected"));
        this.classList.add("selected");

        const name = this.getAttribute("data-name");
        const price = parseFloat(this.getAttribute("data-price"));

        selectedComponents[componentType] = { name, price };
        localStorage.setItem("pcBuild", JSON.stringify(selectedComponents));

        updateSummary();
        updateProgress();
        updatePerformanceEstimate();
        checkCompatibility();
      });
    });
  });
}

// 📊 Update summary section
function updateSummary() {
  let totalCost = 0;
  let totalSelected = 0;

  for (let key in selectedComponents) {
    totalCost += selectedComponents[key].price;
    totalSelected++;
  }

  document.getElementById("totalCost").textContent = "$" + totalCost.toFixed(2);
  document.getElementById("componentsSelected").textContent = totalSelected + "/9";
  document.getElementById("buildStatus").textContent = "Build Status: " + (totalSelected === 9 ? "✅ Complete" : "In Progress");
}

// ⚠ Check CPU and motherboard compatibility
function checkCompatibility() {
  const cpu = selectedComponents["CPU"]?.name || "";
  const motherboard = selectedComponents["Motherboard"]?.name || "";

  if (cpu && motherboard) {
    const cpuBrand = cpu.toLowerCase().includes("intel") ? "intel" :
                     cpu.toLowerCase().includes("amd") ? "amd" : null;
    const boardBrand = motherboard.toLowerCase().includes("intel") ? "intel" :
                       motherboard.toLowerCase().includes("amd") ? "amd" : null;

    if (cpuBrand && boardBrand && cpuBrand !== boardBrand) {
      showCompatibilityWarning(`⚠ Incompatible configuration: ${cpuBrand.toUpperCase()} CPU with ${boardBrand.toUpperCase()} board.`);
    } else {
      hideCompatibilityWarning();
    }
  } else {
    hideCompatibilityWarning();
  }
}

// 🟢 Update progress circle
function updateProgress() {
  const totalParts = 9;
  const selectedCount = Object.keys(selectedComponents).length;
  const percent = Math.round((selectedCount / totalParts) * 100);

  document.getElementById("progressCircle").textContent = percent + "%";
  document.getElementById("progressText").textContent = selectedCount + "/" + totalParts + " Components";
}

// 🎮 Estimate performance based on GPU
function updatePerformanceEstimate() {
  const gpuName = (selectedComponents["GPU (Graphics Card)"]?.name || "").toLowerCase();
  let score = 0;

  if (gpuName.includes("5090")) score += 5;
  else if (gpuName.includes("4080")) score += 4;
  else if (gpuName.includes("4070")) score += 3;
  else if (gpuName.includes("7600")) score += 1;

  let performance = "Estimated Performance: Select GPU";
  if (score >= 5) performance = "Ultimate: 4K+ Ray Tracing Gaming";
  else if (score >= 4) performance = "High End: 4K Gaming";
  else if (score >= 3) performance = "Mid-Range: 1440P Gaming";
  else if (score >= 1) performance = "Entry-Level: 1080P Gaming";

  document.getElementById("performanceLevel").textContent = performance;
}

// ⚠ Show/hide compatibility warning
function showCompatibilityWarning(message) {
  const warningBox = document.getElementById("compatibilityWarning");
  warningBox.textContent = message;
  warningBox.style.display = "block";
}

function hideCompatibilityWarning() {
  const warningBox = document.getElementById("compatibilityWarning");
  if (warningBox) warningBox.style.display = "none";
}

// 🔄 Reset build and clear localStorage
function resetBuild() {
  selectedComponents = {};
  localStorage.removeItem("pcBuild");

  document.querySelectorAll(".component-option.selected").forEach(el => el.classList.remove("selected"));

  document.getElementById("totalCost").textContent = "$0.00";
  document.getElementById("componentsSelected").textContent = "0/9";
  document.getElementById("performanceLevel").textContent = "Estimated Performance: Select GPU";
  document.getElementById("buildStatus").textContent = "Build Status: Incomplete";
  document.getElementById("progressCircle").textContent = "0%";
  document.getElementById("progressText").textContent = "0/9 Components";

  hideCompatibilityWarning();
}

// 📋 Export build summary
function exportBuild() {
  let summary = "Your PC Build:\n";
  let total = 0;

  for (let type in selectedComponents) {
    const part = selectedComponents[type];
    summary += `• ${type}: ${part.name} ($${part.price})\n`;
    total += part.price;
  }

  summary += `\nTotal Cost: $${total.toFixed(2)}`;
  alert(summary);
}

// 📤 Share build (placeholder)
function shareBuild() {
  alert("Sharing feature coming soon!");
}

// 🖱 Scroll listener
window.addEventListener('scroll', () => {
  updateProgress();
  animateStepsOnScroll();
});

// 🧩 DOM ready: initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  setupComponentSelection();
});