<<<<<<< HEAD
// content.js

document.addEventListener("dblclick", async (e) => {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  // If no text is selected or text is too long, ignore
  if (!text || text.length > 50) return;

  // 1. Remove any existing tooltips
  removeExistingTooltip();

  // 2. Send message to background script to fetch translation
  try {
    const response = await chrome.runtime.sendMessage({
      action: "translate",
      text: text
    });

    if (response && response.translation) {
      showTooltip(response.translation, e.pageX, e.pageY);
    }
  } catch (error) {
    console.error("Translation failed:", error);
  }
});

// Remove tooltip when clicking anywhere else
document.addEventListener("click", (e) => {
  // If the click is not inside the tooltip, remove it
  if (!e.target.classList.contains("fr-en-tooltip")) {
    removeExistingTooltip();
  }
});

function showTooltip(text, x, y) {
  const tooltip = document.createElement("div");
  tooltip.className = "fr-en-tooltip";
  tooltip.textContent = text;
  
  // Position the tooltip near the mouse click
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;

  document.body.appendChild(tooltip);
}

function removeExistingTooltip() {
  const existing = document.querySelector(".fr-en-tooltip");
  if (existing) {
    existing.remove();
  }
=======
// content.js

document.addEventListener("dblclick", async (e) => {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  // If no text is selected or text is too long, ignore
  if (!text || text.length > 50) return;

  // 1. Remove any existing tooltips
  removeExistingTooltip();

  // 2. Send message to background script to fetch translation
  try {
    const response = await chrome.runtime.sendMessage({
      action: "translate",
      text: text
    });

    if (response && response.translation) {
      showTooltip(response.translation, e.pageX, e.pageY);
    }
  } catch (error) {
    console.error("Translation failed:", error);
  }
});

// Remove tooltip when clicking anywhere else
document.addEventListener("click", (e) => {
  // If the click is not inside the tooltip, remove it
  if (!e.target.classList.contains("fr-en-tooltip")) {
    removeExistingTooltip();
  }
});

function showTooltip(text, x, y) {
  const tooltip = document.createElement("div");
  tooltip.className = "fr-en-tooltip";
  tooltip.textContent = text;
  
  // Position the tooltip near the mouse click
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;

  document.body.appendChild(tooltip);
}

function removeExistingTooltip() {
  const existing = document.querySelector(".fr-en-tooltip");
  if (existing) {
    existing.remove();
  }
>>>>>>> c612a968054f2fa7eb4c0c0c6bdddb1e2c11b63b
}