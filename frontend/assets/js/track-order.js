const orderIdSpan = document.getElementById("order-id");
const orderStatusDiv = document.getElementById("order-status");
const refreshBtn = document.getElementById("refresh-btn");

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../auth/login.html";
    return {};
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

// نجيب orderId من الـ URL
function getOrderIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("orderId");
}

const orderId = getOrderIdFromURL();
orderIdSpan.textContent = orderId;

// شكل الـ status
function renderStatus(status) {
  switch (status) {
    case "PENDING":
      return { text: "طلبك قيد الانتظار ⏳", color: "bg-yellow-100 text-yellow-700" };
    case "PREPARING":
      return { text: "طلبك قيد التجهيز 👨‍🍳", color: "bg-blue-100 text-blue-700" };
    case "READY":
      return { text: "طلبك جاهز للاستلام ✅", color: "bg-green-100 text-green-700" };
    case "COMPLETED":
      return { text: "تم استلام الطلب 🎉", color: "bg-gray-200 text-gray-700" };
    default:
      return { text: status, color: "bg-gray-100 text-gray-600" };
  }
}

async function fetchOrderStatus() {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error("فشل تحميل حالة الطلب");
    }

    const order = await response.json();
    const statusUI = renderStatus(order.status);

    orderStatusDiv.textContent = statusUI.text;
    orderStatusDiv.className =
      `text-center text-xl font-bold py-4 rounded-lg ${statusUI.color}`;

  } catch (error) {
    orderStatusDiv.textContent = error.message;
    orderStatusDiv.className =
      "text-center text-xl font-bold py-4 rounded-lg bg-red-100 text-red-600";
  }
}

refreshBtn.addEventListener("click", fetchOrderStatus);

fetchOrderStatus();
