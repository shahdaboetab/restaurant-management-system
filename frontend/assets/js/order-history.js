const ordersContainer = document.getElementById("orders");
const loadingMessage = document.getElementById("loading-message");

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

function getStatusDisplay(status) {
  switch (status) {
    case "PENDING": return { text: "قيد الانتظار", color: "bg-yellow-500" };
    case "PREPARING": return { text: "قيد التجهيز", color: "bg-blue-500" };
    case "READY": return { text: "جاهز", color: "bg-green-500" };
    case "COMPLETED": return { text: "مكتمل", color: "bg-gray-500" };
    default: return { text: status, color: "bg-gray-400" };
  }
}

function createOrderCard(order) {
  const { text, color } = getStatusDisplay(order.status);

  const card = document.createElement("div");
  card.className = "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-green-500 mb-4";

  card.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-bold">طلب رقم #${order.id}</h3>
      <span class="${color} text-white text-xs font-semibold px-3 py-1 rounded-full">
        ${text}
      </span>
    </div>

    <p class="text-sm text-gray-600 mb-2">
      <i class="fas fa-clock mr-2 text-green-500"></i>
      ${new Date(order.timestamp).toLocaleString()}
    </p>

    <p class="text-lg font-bold mb-4">
      الإجمالي: ${order.totalPrice.toFixed(2)} SAR
    </p>

    <a href="track-order.html?orderId=${order.id}"
       class="block text-center bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
      تتبع الطلب
    </a>
  `;

  return card;
}

async function fetchOrderHistory() {
  loadingMessage.classList.remove("hidden");
  ordersContainer.innerHTML = "";

  try {
    const userId = localStorage.getItem("userId");
    const response = await fetch(`${BASE_URL}/orders/customer/${userId}`, { headers: getAuthHeaders() });

    if (!response.ok) throw new Error("فشل تحميل الطلبات");

    const orders = await response.json();
    loadingMessage.classList.add("hidden");

    if (orders.length === 0) {
      ordersContainer.innerHTML = `<p class="text-center text-gray-500">لا توجد طلبات سابقة</p>`;
      return;
    }

    orders.forEach(order => ordersContainer.appendChild(createOrderCard(order)));

  } catch (error) {
    console.error(error);
    loadingMessage.textContent = error.message;
    loadingMessage.classList.remove("hidden");
  }
}

fetchOrderHistory();
