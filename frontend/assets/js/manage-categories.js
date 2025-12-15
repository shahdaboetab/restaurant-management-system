// ملف: ../assets/js/manage-categories.js

const categoriesTableBody = document.getElementById("categories-table-body");
const categoryModal = document.getElementById("category-modal");
const modalTitle = document.getElementById("modal-title");
const categoryForm = document.getElementById("category-form");
const messageContainer = document.getElementById("message-container");

let isEditMode = false;
let currentCategoryId = null;

// Utility function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Utility to show messages
function showMessage(text, isError = false) {
  messageContainer.textContent = text;
  messageContainer.className = `p-4 mb-4 rounded-lg text-sm block ${
    isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
  }`;
  messageContainer.classList.remove("hidden");
  setTimeout(() => {
    messageContainer.classList.add("hidden");
  }, 5000);
}

// ------------------------------------
// 1. Fetching Data
// ------------------------------------
async function fetchCategories() {
  categoriesTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">
                                      <i class="fas fa-spinner fa-spin mr-2"></i> Loading categories...
                                   </td></tr>`;
  try {
    const response = await fetch(`${BASE_URL}/api/categories`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch categories.");

    const categories = await response.json();
    renderTable(categories);
  } catch (error) {
    console.error("Categories Fetch Error:", error);
    categoriesTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-red-500 font-bold">
                                            Error: Could not load categories.
                                        </td></tr>`;
    showMessage("Error loading categories. Check network connection.", true);
  }
}

// Render the fetched data into the table
function renderTable(categories) {
  categoriesTableBody.innerHTML = "";
  if (categories.length === 0) {
    categoriesTableBody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">No categories found.</td></tr>`;
    return;
  }

  categories.forEach((category) => {
    const row = document.createElement("tr");
    row.className = "border-b border-gray-200 hover:bg-gray-100";
    row.innerHTML = `
            <td class="py-3 px-6 text-left whitespace-nowrap">${category.id}</td>
            <td class="py-3 px-6 text-left font-medium">${category.name}</td>
            <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center space-x-3">
                    <button class="edit-btn text-blue-600 hover:text-blue-800" data-id="${category.id}" data-name="${category.name}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-800" data-id="${category.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
    categoriesTableBody.appendChild(row);
  });

  // Attach event listeners
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      openModalForEdit(btn.dataset.id, btn.dataset.name)
    );
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteCategory(btn.dataset.id));
  });
}

// ------------------------------------
// 2. Modal and Form Management
// ------------------------------------

function openModal(title) {
  modalTitle.textContent = title;
  categoryModal.classList.remove("hidden");
  categoryModal.classList.add("flex");
}

function closeModal() {
  categoryForm.reset();
  categoryModal.classList.add("hidden");
  categoryModal.classList.remove("flex");
  isEditMode = false;
  currentCategoryId = null;
  document.getElementById("category-id").value = "";
}

document.getElementById("open-add-modal").addEventListener("click", () => {
  openModal("Add New Category");
  isEditMode = false;
});

document.getElementById("close-modal").addEventListener("click", closeModal);

function openModalForEdit(id, name) {
  openModal(`Edit Category: ${name}`);
  isEditMode = true;
  currentCategoryId = id;

  // Populate form fields
  document.getElementById("category-id").value = id;
  document.getElementById("name").value = name;
}

// ------------------------------------
// 3. API Actions (Add/Edit/Delete)
// ------------------------------------

categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const categoryData = {
    name: document.getElementById("name").value,
  };

  const categoryId = document.getElementById("category-id").value;
  const method = isEditMode ? "PUT" : "POST";
  const url = isEditMode
    ? `${BASE_URL}/api/categories/${categoryId}`
    : `${BASE_URL}/api/categories`;

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Failed to ${isEditMode ? "update" : "add"} category.`
      );
    }

    showMessage(`Category successfully ${isEditMode ? "updated" : "added"}!`);
    closeModal();
    fetchCategories(); // Refresh the table
  } catch (error) {
    console.error("Save Category Error:", error);
    showMessage(error.message, true);
  }
});

async function deleteCategory(categoryId) {
  if (
    !confirm(
      `WARNING: Deleting category ID ${categoryId} will affect all associated menu items. Are you sure?`
    )
  ) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete category.");
    }

    showMessage(`Category ID ${categoryId} successfully deleted.`);
    fetchCategories(); // Refresh the table
  } catch (error) {
    console.error("Delete Category Error:", error);
    showMessage(error.message, true);
  }
}

// ------------------------------------
// 4. Initialization
// ------------------------------------
document.addEventListener("DOMContentLoaded", fetchCategories);
