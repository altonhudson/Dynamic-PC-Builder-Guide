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
// Global tracker
// Store selected components in an object
let selectedComponents = {};

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
     });
    })
   })
};

// Update the summary section
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

// Show progress circle
function updateProgress() {
    let totalParts = 9;
    let selectedCount = Object.keys(selectedComponents).length;
    let percent = Math.round((selectedCount / totalParts) * 100);

    document.getElementById("progressCircle").textContent = percent + "%";
    document.getElementById("progressText").textContent = selectedCount + "/" + totalParts + " Components";
}

// Export build summary
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

}
// Coming soon
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