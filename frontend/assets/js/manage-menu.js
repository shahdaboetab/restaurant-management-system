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
    const response = await fetch(`${BASE_URL}/api/categories`, {  // تعديل هنا
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
  menuItemsTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">
                                      <i class="fas fa-spinner fa-spin mr-2"></i> Loading menu items...
                                   </td></tr>`;
  try {
    const response = await fetch(`${BASE_URL}/api/menu-items`, {  // تعديل هنا
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch menu items.");

    const menuItems = await response.json();
    renderTable(menuItems);
  } catch (error) {
    console.error("Menu Items Fetch Error:", error);
    menuItemsTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500 font-bold">
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
            <td class="py-3 px-6 text-center">
                <div class="flex item-center justify-center space-x-3">
                    <button class="edit-btn text-blue-600 hover:text-blue-800" data-id="${item.id}" data-item='${JSON.stringify(item)}'>
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-800" data-id="${item.id}">
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
  // Clear file input
  document.getElementById("image-file").value = "";
  // Hide current image container
  document.getElementById("current-image-container").classList.add("hidden");
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

  // Select the correct category
  if (item.categoryId) {
    document.getElementById("category-id").value = item.categoryId;
  }

  // Handle current image display
  const currentImageContainer = document.getElementById("current-image-container");
  const currentImage = document.getElementById("current-image");
  if (item.imageUrl) {
    currentImage.src = item.imageUrl;
    currentImageContainer.classList.remove("hidden");
  } else {
    currentImageContainer.classList.add("hidden");
  }

  // Clear file input for edit mode (user can choose to upload new image or keep existing)
  document.getElementById("image-file").value = "";
}

// ------------------------------------
// 3. API Actions (Add/Edit/Delete)
// ------------------------------------

itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const itemId = document.getElementById("item-id").value;
  const isEditMode = itemId !== "";

  if (isEditMode) {
    // Edit mode - send JSON data
    const itemData = {
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      price: parseFloat(document.getElementById("price").value),
      categoryId: parseInt(document.getElementById("category-id").value),
      imageUrl: null // Will be handled by checking if new file is uploaded
    };

    // Check if a new image file is selected
    const imageFile = document.getElementById("image-file").files[0];
    if (imageFile) {
      // If new file is uploaded, we need to use the upload endpoint
      const formData = new FormData();
      formData.append("name", itemData.name);
      formData.append("description", itemData.description);
      formData.append("price", itemData.price);
      formData.append("categoryId", itemData.categoryId);
      formData.append("imageFile", imageFile);

      try {
        const headers = getAuthHeaders();
        delete headers["Content-Type"];

        const response = await fetch(`${BASE_URL}/api/menu-items/upload`, {
          method: "POST",
          headers: headers,
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update item.");
        }

        // After successful upload, we need to update the existing item with the new data
        // But since upload creates a new item, we need to delete the old one and update with new ID
        // This is a limitation - let's use a different approach

        showMessage("Image update requires recreating the item. Please delete and re-add the item with new image.", true);
        closeModal();
        return;

      } catch (error) {
        console.error("Update Item Error:", error);
        showMessage(error.message, true);
        return;
      }
    } else {
      // No new image - update other fields only
      try {
        const response = await fetch(`${BASE_URL}/api/menu-items/${itemId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(itemData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to update item.");
        }

        showMessage("Item successfully updated!");
        closeModal();
        fetchMenuItems();
      } catch (error) {
        console.error("Update Item Error:", error);
        showMessage(error.message, true);
      }
    }
  } else {
    // Add mode - use FormData
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("price", parseFloat(document.getElementById("price").value));
    formData.append("categoryId", parseInt(document.getElementById("category-id").value));

    const imageFile = document.getElementById("image-file").files[0];
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      const headers = getAuthHeaders();
      delete headers["Content-Type"];

      const response = await fetch(`${BASE_URL}/api/menu-items/upload`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add item.");
      }

      showMessage("Item successfully added!");
      closeModal();
      fetchMenuItems();
    } catch (error) {
      console.error("Add Item Error:", error);
      showMessage(error.message, true);
    }
  }
});

async function deleteItem(itemId) {
  if (
    !confirm(`Are you sure you want to permanently delete item ID ${itemId}?`)
  ) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/menu-items/${itemId}`, {
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
