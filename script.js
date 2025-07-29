
// Global tracker
// Store selected components in an object
let selectedComponents = {};

document.addEventListener("DOMContentLoaded", function () {
    let allSteps = document.querySelectorAll(".step");

    for (let i = 0; i < allSteps.length; i++) {
        let step = allSteps[i];
        let componentOptions = step.querySelectorAll(".component-option");
        let componentType = step.getAttribute("data-component");

        for (let j = 0; j < componentOptions.length; j++) {
            let option = componentOptions[j];

            option.addEventListener("click", function () {
                // Deselect all options in this step
                for (let k = 0; k < componentOptions.length; k++) {
                    componentOptions[k].classList.remove("selected");
                }

                // Highlight selected option
                this.classList.add("selected");

                // Get the selected option's name and price
                let name = this.getAttribute("data-name");
                let price = parseFloat(this.getAttribute("data-price"));

                // Save selection to the object
                selectedComponents[componentType] = {
                    name: name,
                    price: price
                };

                updateSummary();
                updateProgress();
            });
        }
    }
});

// Update the summary section
function updateSummary() {
    let totalCost = 0;
    let totalSelected = 0;

    for (let key in selectedComponents) {
        totalCost += selectedComponents[key].price;
        totalSelected++;
    }

    document.getElementById("totalCost").textContent = "$" + totalCost.toFixed(2);
    document.getElementById("componentsSelected").textContent = totalSelected + "/4";

    let buildStatus = totalSelected === 4 ? "✅ Complete" : "In Progress";
    document.getElementById("buildStatus").textContent = buildStatus;
}

// Show progress circle
function updateProgress() {
    let totalParts = 9;
    let selectedCount = Object.keys(selectedComponents).length;
    let percent = Math.round((selectedCount / totalParts) * 100);

    document.getElementById("progressCircle").textContent = percent + "%";
    document.getElementById("progressText").textContent = selectedCount + "/" + totalParts + " Components";
}

// Show full build in popup
function exportBuild() {
    alert("Build information will show here.");
}

function resetBuild() {
    window.location.href="index2.html"
}

// Coming soon
function shareBuild() {
    alert("Sharing feature coming soon!");
}