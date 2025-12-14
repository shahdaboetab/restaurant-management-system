// ملف: ../assets/js/manage-users.js

const usersTableBody = document.getElementById("users-table-body");
const messageContainer = document.getElementById("message-container");

// Roles defined in SRS and Use Case Diagram: Admin, Chef, Waiter, Customer
const AVAILABLE_ROLES = ["ADMIN", "CHEF", "WAITER", "CUSTOMER"];

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
// 1. Fetching and Rendering Data
// ------------------------------------
async function fetchUsers() {
  usersTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">
                                      <i class="fas fa-spinner fa-spin mr-2"></i> Loading users...
                                   </td></tr>`;
  try {
    // API Endpoint متوقع: GET /admin/users
    const response = await fetch(`${BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch user list.");

    const users = await response.json();
    renderTable(users);
  } catch (error) {
    console.error("Users Fetch Error:", error);
    usersTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-red-500 font-bold">
                                            Error: Could not load users.
                                        </td></tr>`;
    showMessage("Error loading users. Check API status.", true);
  }
}

// Render the fetched data into the table
function renderTable(users) {
  usersTableBody.innerHTML = "";
  if (users.length === 0) {
    usersTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">No users found.</td></tr>`;
    return;
  }

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.className = "border-b border-gray-200 hover:bg-gray-100";
    row.innerHTML = `
            <td class="py-3 px-6 text-left whitespace-nowrap">${user.id}</td>
            <td class="py-3 px-6 text-left">${user.name}</td>
            <td class="py-3 px-6 text-left">${user.email}</td>
            <td class="py-3 px-6 text-center">
                <select 
                    id="role-select-${user.id}"
                    data-user-id="${user.id}"
                    class="role-select border border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
                    onchange="updateUserRole(${user.id}, this.value)"
                >
                    ${AVAILABLE_ROLES.map(
                      (role) => `
                        <option value="${role}" ${
                        user.role === role ? "selected" : ""
                      }>
                            ${role}
                        </option>
                    `
                    ).join("")}
                </select>
            </td>
            <td class="py-3 px-6 text-center">
                <button 
                    class="text-red-600 hover:text-red-800" 
                    onclick="deleteUser(${user.id})"
                >
                    <i class="fas fa-user-times"></i> Delete
                </button>
            </td>
        `;
    usersTableBody.appendChild(row);
  });
}

// ------------------------------------
// 2. API Actions (Update Role / Delete)
// ------------------------------------

async function updateUserRole(userId, newRole) {
  const confirmChange = confirm(
    `Are you sure you want to change the role of User ID ${userId} to ${newRole}?`
  );
  if (!confirmChange) {
    // Revert the dropdown selection if the user cancels
    fetchUsers();
    return;
  }

  try {
    // API Endpoint متوقع: PUT /admin/users/{id}/role
    const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user role.");
    }

    showMessage(`User ID ${userId} role successfully updated to ${newRole}.`);
    fetchUsers(); // Optional: Re-fetch to confirm/update the table appearance
  } catch (error) {
    console.error("Update Role Error:", error);
    showMessage(error.message, true);
    fetchUsers(); // Revert the table on error
  }
}

async function deleteUser(userId) {
  if (
    !confirm(
      `Are you sure you want to permanently delete User ID ${userId}? This action cannot be undone.`
    )
  ) {
    return;
  }

  try {
    // API Endpoint متوقع: DELETE /admin/users/{id}
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user.");
    }

    showMessage(`User ID ${userId} successfully deleted.`);
    fetchUsers(); // Refresh the table
  } catch (error) {
    console.error("Delete User Error:", error);
    showMessage(error.message, true);
  }
}

// Make functions globally available for use in inline HTML 'onchange'
window.updateUserRole = updateUserRole;
window.deleteUser = deleteUser;

// ------------------------------------
// 3. Initialization
// ------------------------------------
document.addEventListener("DOMContentLoaded", fetchUsers);
