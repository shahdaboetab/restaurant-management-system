// ملف: ../assets/js/update-order.js

const orderIdDisplay = document.getElementById("order-id-display");
const orderItemsList = document.getElementById("order-items-list");
const currentStatusElement = document.getElementById("current-status");
const messageContainer = document.getElementById("message-container");
const statusCard = document.getElementById("status-card");

let currentOrderId = null;

// Utility function to get JWT token headers
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../auth/login.html";
    return {};
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Utility function to display messages
function displayMessage(text, isError = false) {
  messageContainer.textContent = text;
  messageContainer.className = `text-center text-lg p-4 rounded-lg block ${
    isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
  }`;
  setTimeout(() => {
    messageContainer.classList.add("hidden");
  }, 5000);
}

// Utility function for status mapping
function getStatusDisplay(status) {
  switch (status) {
    case "PENDING":
      return {
        text: "Pending Confirmation",
        color: "text-red-600",
        border: "border-red-500",
      };
    case "PREPARING":
      return {
        text: "Preparing",
        color: "text-yellow-600",
        border: "border-yellow-500",
      };
    case "READY":
      return {
        text: "Ready for Pickup",
        color: "text-green-600",
        border: "border-green-500",
      };
    case "COMPLETED":
      return {
        text: "Completed/Closed",
        color: "text-gray-600",
        border: "border-gray-500",
      };
    default:
      return {
        text: status,
        color: "text-gray-400",
        border: "border-gray-400",
      };
  }
}

// ------------------------------------
// 1. Fetching Order Details
// ------------------------------------
async function fetchOrderDetails(orderId) {
  displayMessage("Fetching order details...", false);

  try {
    const response = await fetch(`${BASE_URL}/staff/orders/${orderId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
      throw new Error("Order not found.");
    }
    if (!response.ok) {
      throw new Error("Failed to fetch order details.");
    }

    const order = await response.json();

    renderOrderData(order);
    displayMessage("Order successfully loaded.", false);
    setupUpdateButtons(order.status);
  } catch (error) {
    console.error("Fetch Order Error:", error);
    displayMessage(error.message, true);
  }
}

// Function to render order data in the UI
function renderOrderData(order) {
  const { text, color, border } = getStatusDisplay(order.status);

  // Update titles and status card style
  orderIdDisplay.textContent = order.id;
  currentStatusElement.textContent = text;
  currentStatusElement.className = `text-3xl font-extrabold ${color}`;
  statusCard.className = `bg-white p-6 rounded-xl shadow-lg border-l-4 ${border}`;

  // Update Summary
  document.getElementById("customer-name").textContent =
    order.customerName || `Customer #${order.userId}`;
  document.getElementById(
    "total-price"
  ).textContent = `${order.totalPrice.toFixed(2)} EGP`;
  document.getElementById("order-date").textContent = new Date(
    order.timestamp
  ).toLocaleString();

  // Render Order Items
  orderItemsList.innerHTML = "";
  if (order.items && order.items.length > 0) {
    order.items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className =
        "flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition";
      itemElement.innerHTML = `
                <span class="text-lg font-medium text-gray-800">${
                  item.menuItemName
                }</span>
                <span class="text-gray-600">
                    <span class="font-bold text-red-500">${
                      item.quantity
                    }</span> x 
                    ${item.price.toFixed(2)} SAR
                </span>
            `;
      orderItemsList.appendChild(itemElement);
    });
  } else {
    orderItemsList.innerHTML =
      '<p class="text-center text-gray-500 p-4">No items in this order.</p>';
  }
}

// ------------------------------------
// 2. Updating Order Status
// ------------------------------------
async function updateOrderStatus(newStatus) {
  if (!currentOrderId) return;

  if (
    !confirm(
      `Are you sure you want to change order #${currentOrderId} status to: ${
        getStatusDisplay(newStatus).text
      }?`
    )
  ) {
    return;
  }

  displayMessage(`Updating status to ${getStatusDisplay(newStatus).text}...`);

  try {
    const response = await fetch(
      `${BASE_URL}/staff/orders/${currentOrderId}/status`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      // Handle specific status errors (e.g., 400 Bad Request if status transition is invalid)
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Failed to update order status. Check transition logic."
      );
    }

    // Success - Reload data to update UI
    displayMessage(
      `Order #${currentOrderId} status successfully updated to: ${
        getStatusDisplay(newStatus).text
      }!`,
      false
    );
    fetchOrderDetails(currentOrderId);
  } catch (error) {
    console.error("Update Status Error:", error);
    displayMessage(error.message, true);
  }
}

// Function to control button visibility and click handlers
function setupUpdateButtons(currentStatus) {
  const statusButtons = document.querySelectorAll(".status-btn");
  statusButtons.forEach((button) => {
    const newStatus = button.getAttribute("data-new-status");

    button.classList.remove("hidden");

    // Disable or hide buttons based on logic (e.g., cannot go back from READY to PENDING)
    if (
      newStatus === currentStatus ||
      currentStatus === "COMPLETED" || // Cannot change anything after completion
      (newStatus === "PREPARING" && currentStatus === "READY") ||
      (newStatus === "PREPARING" && currentStatus === "COMPLETED") ||
      (newStatus === "READY" && currentStatus === "COMPLETED")
      // The staff cannot jump directly to COMPLETED from PENDING without going through PREPARING and READY (Based on diagram flow)
    ) {
      button.classList.add("hidden");
    }

    // Attach click event
    button.onclick = () => updateOrderStatus(newStatus);
  });
}

// ------------------------------------
// 3. Page Initialization
// ------------------------------------
function initializeUpdatePage() {
  // 1. Get Order ID from URL parameter: ?orderId=123
  const urlParams = new URLSearchParams(window.location.search);
  currentOrderId = urlParams.get("orderId");

  if (!currentOrderId) {
    displayMessage("Error: Order ID is missing.", true);
    setTimeout(() => {
      window.location.href = "orders.html";
    }, 2000);
    return;
  }

  // 2. Fetch order details
  fetchOrderDetails(currentOrderId);
}

document.addEventListener("DOMContentLoaded", initializeUpdatePage);
