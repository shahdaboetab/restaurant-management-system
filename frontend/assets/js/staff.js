// ملف: ../assets/js/staff.js

const ordersList = document.getElementById("orders-list");
const loadingMessage = document.getElementById("loading-message");

// Function to get the JWT token from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    // Redirect to login if no token is found (Security enforcement)
    window.location.href = "../auth/login.html";
    return {};
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Pass the JWT token for authentication
  };
}

// Function to map status to a display name and color
function getStatusDisplay(status) {
  switch (status) {
    case "PENDING":
      return { text: "جديد (بانتظار التأكيد)", color: "bg-red-500" };
    case "PREPARING":
      return { text: "قيد التجهيز", color: "bg-yellow-500" };
    case "READY":
      return { text: "جاهز للاستلام", color: "bg-green-500" };
    case "COMPLETED":
      return { text: "مكتمل", color: "bg-gray-500" };
    default:
      return { text: status, color: "bg-gray-400" };
  }
}

// Function to render an Order Card
function createOrderCard(order) {
  const { text, color } = getStatusDisplay(order.status);

  // Check if staff can update the status (only if not completed)
  const canUpdate = order.status !== "COMPLETED";

  // تصحيح: التعامل مع عدم وجود اسم العميل وعرض الرقم بدلاً منه
  const customerDisplay = order.customerName 
    ? order.customerName 
    : (order.customerId ? `عميل رقم ${order.customerId}` : "غير معروف");

  const card = document.createElement("div");
  card.className =
    "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-red-500";
  
  // تصحيح: استخدام order.orderId بدلاً من order.id
  // تصحيح: استخدام order.createdAt بدلاً من order.timestamp
  card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-gray-800">طلب رقم #${
              order.orderId
            }</h3>
            <span class="${color} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">${text}</span>
        </div>
        
        <p class="text-sm text-gray-600 mb-2">
            <i class="fas fa-user-tag mr-2 text-red-500"></i>
            العميل: ${customerDisplay}
        </p>
        <p class="text-sm text-gray-600 mb-2">
            <i class="fas fa-clock mr-2 text-red-500"></i>
            الوقت: ${new Date(order.createdAt).toLocaleString()}
        </p>
        <p class="text-lg font-bold text-gray-800 mb-4">
            <i class="fas fa-money-bill-wave mr-2 text-red-500"></i>
            الإجمالي: ${order.totalPrice.toFixed(2)} SAR
        </p>
        
        <div class="border-t pt-4">
            ${
              canUpdate
                ? `
                <button 
                    data-order-id="${order.orderId}" 
                    class="view-order-btn w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    <i class="fas fa-cogs mr-2"></i> 
                    تحديث حالة الطلب
                </button>
            `
                : `
                <p class="text-center text-green-600 font-semibold">
                    <i class="fas fa-check-circle mr-2"></i> 
                    الطلب مكتمل
                </p>
            `
            }
        </div>
    `;
  return card;
}

// Main function to fetch and display orders
async function fetchOrders(statusFilter) {
  loadingMessage.classList.remove("hidden");
  ordersList.innerHTML = ""; // Clear previous orders

  try {
    // Base URL will fetch all orders or assigned orders (Backend handles authorization)
    // Correct Endpoint: /api/orders
    const url = `${BASE_URL}/api/orders?status=${statusFilter}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.status === 403) {
      throw new Error("غير مصرح لك بمشاهدة هذه الطلبات. تأكد من دورك (Staff).");
    }

    if (!response.ok) {
      throw new Error("فشل في جلب الطلبات من النظام.");
    }

    const orders = await response.json();

    loadingMessage.classList.add("hidden");

    if (orders.length === 0) {
      ordersList.innerHTML = `<p class="col-span-full text-center text-xl text-gray-500 p-8">لا توجد طلبات في حالة "${
        getStatusDisplay(statusFilter).text
      }".</p>`;
      return;
    }

    // Render cards
    orders.forEach((order) => {
      ordersList.appendChild(createOrderCard(order));
    });

    // Add event listeners for the 'Update Status' buttons
    document.querySelectorAll(".view-order-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        // تصحيح: استخدام الزر نفسه وليس e.target مباشرة لتجنب المشاكل إذا ضغط المستخدم على الأيقونة داخل الزر
        const btn = e.target.closest('.view-order-btn');
        if (btn) {
            const orderId = btn.getAttribute("data-order-id");
            // Redirect to the update page with the Order ID
            window.location.href = `update-order.html?orderId=${orderId}`;
        }
      });
    });
  } catch (error) {
    console.error("Orders fetching error:", error);
    loadingMessage.textContent =
      error.message || "حدث خطأ غير متوقع أثناء جلب الطلبات.";
    loadingMessage.classList.remove("hidden");
    // Optionally, redirect to login if authorization fails completely
    if (error.message.includes("غير مصرح لك")) {
      setTimeout(() => {
        window.location.href = "../auth/login.html";
      }, 2000);
    }
  }
}

// Initialize Dashboard (Load PENDING orders by default)
const initialStatus = "PENDING";
fetchOrders(initialStatus);

// Tab Switching Logic
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedStatus = e.target.getAttribute("data-status");

    // Update button styles
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("bg-red-600", "text-white");
      btn.classList.add("text-gray-600");
    });
    e.target.classList.remove("text-gray-600");
    e.target.classList.add("bg-red-600", "text-white");

    // Fetch new data
    fetchOrders(selectedStatus);
  });
});