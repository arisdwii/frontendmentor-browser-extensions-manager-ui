// Select theme toggle button and containers/buttons
const btnThemeToggle = document.querySelector(".theme-toggle-button");
const extensionsContainer = document.querySelector(".extensions-container");
const btnFilters = document.querySelectorAll(".filter-button");

let extensionsData = []; // Store all extensions data
let currentFilter = "all"; // Current filter state

// Fetch data from JSON and initialize
fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    // Add unique id to each extension item
    extensionsData = data.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    // Render the initial list with default filter
    renderAndSetup(getFilteredData(currentFilter));
  });

// Filter extensions data based on current filter
function getFilteredData(filter) {
  switch (filter) {
    case "active":
      return extensionsData.filter((item) => item.isActive);
    case "inactive":
      return extensionsData.filter((item) => !item.isActive);
    default:
      return extensionsData;
  }
}

// Render extensions and setup event listeners for buttons
function renderAndSetup(data) {
  renderExtensions(data); // Render the extension cards
  setupRemoveButtons(); // Attach event listeners for remove buttons
  setupToggleButtons(); // Attach event listeners for toggle buttons
}

// Render the extension cards into the container
function renderExtensions(data) {
  extensionsContainer.innerHTML = ""; // Clear existing content

  data.forEach((item) => {
    extensionsContainer.innerHTML += `
      <article class="extension-card">
        <div class="extension-info">
          <img src="${item.logo}" alt="${
      item.name
    }" class="img-extension-logo" draggable="false">
          <div class="text-extension">
            <h3 class="title-extension">${item.name}</h3>
            <p class="desc-extension">${item.description}</p>
          </div>
        </div>

        <div class="actions-extension">
          <button type="button" class="btn-remove" data-id="${
            item.id
          }">Remove</button>
          <button type="button" class="btn-toggle ${
            item.isActive ? "active" : ""
          }" aria-label="Toggle extension" data-id="${item.id}">
            <span class="slider-toggle"></span>
          </button>
        </div>
      </article>
    `;
  });
}

// Setup click listeners for filter buttons
btnFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter; // Update current filter

    // Update active class for buttons UI
    btnFilters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Render and setup extensions with the selected filter
    const filtered = getFilteredData(currentFilter);
    renderAndSetup(filtered);
  });
});

// Setup event listeners for all remove buttons
function setupRemoveButtons() {
  const removeButtons = document.querySelectorAll(".btn-remove");

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);

      // Remove extension by filtering it out from data array
      extensionsData = extensionsData.filter((item) => item.id !== id);

      // Re-render extensions based on current filter
      renderAndSetup(getFilteredData(currentFilter));
    });
  });
}

// Setup event listeners for all toggle buttons
function setupToggleButtons() {
  const toggleButtons = document.querySelectorAll(".btn-toggle");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);

      // Toggle isActive state for the clicked extension
      extensionsData = extensionsData.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      );

      // Re-render extensions based on current filter
      renderAndSetup(getFilteredData(currentFilter));
    });
  });
}

// Theme toggle button click listener
btnThemeToggle.addEventListener("click", () => {
  btnThemeToggle.classList.toggle("dark"); // Toggle dark class on button
  document.body.classList.toggle("dark"); // Toggle dark class on body for theme
});
