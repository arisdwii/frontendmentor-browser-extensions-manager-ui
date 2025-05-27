const btnThemeToggle = document.querySelector(".theme-toggle-button");
const extensionsContainer = document.querySelector(".extensions-container");
const btnFilter = document.querySelectorAll(".filter-button");

let extensionsData = [];
let currentFilter = "all";

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    extensionsData = data.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    renderAndSetup(getFilteredData(currentFilter));
  });

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

function renderAndSetup(data) {
  renderExtensionsHTML(data);
  setupRemoveButtons();
  setupToggleButtons();
}

function renderExtensionsHTML(data) {
  extensionsContainer.innerHTML = "";

  data.forEach((item) => {
    extensionsContainer.innerHTML += `
      <article class="extension-card">
        <div class="extension-info">
          <img src="${item.logo}" alt="${
      item.name
    }" class="extension-logo" draggable="false">
          <div class="extension-text">
            <h3 class="extension-title">${item.name}</h3>
            <p class="extension-desc">${item.description}</p>
          </div>
        </div>

        <div class="extension-actions">
          <button type="button" class="remove-button" data-id="${
            item.id
          }">Remove</button>
          <button type="button" class="toggle-button ${
            item.isActive ? "active" : ""
          }" aria-label="Toggle extension" data-id="${item.id}">
            <span class="slider"></span>
          </button>
        </div>
      </article>
    `;
  });
}

btnFilter.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    btnFilter.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filtered = getFilteredData(currentFilter);
    renderExtensionsHTML(filtered);
  });
});

function setupRemoveButtons() {
  const removeButtons = document.querySelectorAll(".remove-button");

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      extensionsData = extensionsData.filter((item) => item.id !== id);
      renderAndSetup(getFilteredData(currentFilter));
    });
  });
}

function setupToggleButtons() {
  const toggleButtons = document.querySelectorAll(".toggle-button");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);

      extensionsData = extensionsData.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      );

      renderAndSetup(getFilteredData(currentFilter));
    });
  });
}

btnThemeToggle.addEventListener("click", () => {
  btnThemeToggle.classList.toggle("dark");
  document.body.classList.toggle("dark");
});
