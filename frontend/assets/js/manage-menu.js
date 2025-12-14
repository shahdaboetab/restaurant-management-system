// ملف: ../assets/js/manage-menu.js

const menuItemsTableBody = document.getElementById("menu-items-table-body");
const itemModal = document.getElementById("item-modal");
const modalTitle = document.getElementById("modal-title");
const itemForm = document.getElementById("item-form");
const categorySelect = document.getElementById("category-id");
const messageContainer = document.getElementById("message-container");

let isEditMode = false;
let currentItemId = null;

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
// 1. Fetching Data (Categories & Menu Items)
// ------------------------------------

// Fetch Categories and populate the select dropdown
async function fetchCategories() {
  try {
    const response = await fetch(`${BASE_URL}/admin/categories`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch categories.");

    const categories = await response.json();
    categorySelect.innerHTML = "";
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Categories Fetch Error:", error);
    categorySelect.innerHTML =
      '<option value="">Error loading categories</option>';
    showMessage("Error loading categories. Check API status.", true);
  }
}

// Fetch Menu Items and render the table
async function fetchMenuItems() {
  menuItemsTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">
                                      <i class="fas fa-spinner fa-spin mr-2"></i> Loading menu items...
                                   </td></tr>`;
  try {
    const response = await fetch(`${BASE_URL}/admin/menu`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch menu items.");

    const menuItems = await response.json();
    renderTable(menuItems);
  } catch (error) {
    console.error("Menu Items Fetch Error:", error);
    menuItemsTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500 font-bold">
                                            Error: Could not load menu items.
                                        </td></tr>`;
    showMessage("Error loading menu items. Check network connection.", true);
  }
}

// Render the fetched data into the table
function renderTable(items) {
  menuItemsTableBody.innerHTML = "";
  if (items.length === 0) {
    menuItemsTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">No menu items found.</td></tr>`;
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "border-b border-gray-200 hover:bg-gray-100";
    row.innerHTML = `
            <td class="py-3 px-6 text-left whitespace-nowrap">${item.id}</td>
            <td class="py-3 px-6 text-left">${item.name}</td>
            <td class="py-3 px-6 text-left">${item.categoryName || "N/A"}</td>
            <td class="py-3 px-6 text-center">${item.price.toFixed(2)}</td>
            <td class="py-3 px-6 text-center ${
              item.availableStock === 0
                ? "text-red-500 font-bold"
                : "text-green-600"
            }">
                ${item.availableStock}
            </td>
            <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center space-x-3">
                    <button class="edit-btn text-blue-600 hover:text-blue-800" data-id="${
                      item.id
                    }" data-item='${JSON.stringify(item)}'>
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-800" data-id="${
                      item.id
                    }">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
    menuItemsTableBody.appendChild(row);
  });

  // Attach event listeners to newly created buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      openModalForEdit(JSON.parse(btn.dataset.item))
    );
  });
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteItem(btn.dataset.id));
  });
}

// ------------------------------------
// 2. Modal and Form Management
// ------------------------------------

function openModal(title) {
  modalTitle.textContent = title;
  itemModal.classList.remove("hidden");
  itemModal.classList.add("flex");
}

function closeModal() {
  itemForm.reset();
  itemModal.classList.add("hidden");
  itemModal.classList.remove("flex");
  isEditMode = false;
  currentItemId = null;
}

document.getElementById("open-add-modal").addEventListener("click", () => {
  openModal("Add New Menu Item");
  isEditMode = false;
  currentItemId = null;
  document.getElementById("item-id").value = "";
});

document.getElementById("close-modal").addEventListener("click", closeModal);

function openModalForEdit(item) {
  openModal(`Edit Menu Item: ${item.name}`);
  isEditMode = true;
  currentItemId = item.id;

  // Populate form fields
  document.getElementById("item-id").value = item.id;
  document.getElementById("name").value = item.name;
  document.getElementById("description").value = item.description || "";
  document.getElementById("price").value = item.price;
  document.getElementById("available-stock").value = item.availableStock;
  document.getElementById("image-url").value = item.imageUrl || "";

  // Select the correct category
  if (item.categoryId) {
    document.getElementById("category-id").value = item.categoryId;
  }
}

// ------------------------------------
// 3. API Actions (Add/Edit/Delete)
// ------------------------------------

itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const itemData = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
    availableStock: parseInt(document.getElementById("available-stock").value),
    categoryId: parseInt(document.getElementById("category-id").value), // Assuming categoryId is needed by backend
    imageUrl: document.getElementById("image-url").value || null,
  };

  const itemId = document.getElementById("item-id").value;
  const method = isEditMode ? "PUT" : "POST";
  const url = isEditMode
    ? `${BASE_URL}/admin/menu/${itemId}`
    : `${BASE_URL}/admin/menu`;

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Failed to ${isEditMode ? "update" : "add"} item.`
      );
    }

    showMessage(`Item successfully ${isEditMode ? "updated" : "added"}!`);
    closeModal();
    fetchMenuItems(); // Refresh the table
  } catch (error) {
    console.error("Save Item Error:", error);
    showMessage(error.message, true);
  }
});

async function deleteItem(itemId) {
  if (
    !confirm(`Are you sure you want to permanently delete item ID ${itemId}?`)
  ) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/admin/menu/${itemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete item.");
    }

    showMessage(`Item ID ${itemId} successfully deleted.`);
    fetchMenuItems(); // Refresh the table
  } catch (error) {
    console.error("Delete Item Error:", error);
    showMessage(error.message, true);
  }
}

// ------------------------------------
// 4. Initialization
// ------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories(); // Load categories first for the form
  fetchMenuItems(); // Load items for the table
});
