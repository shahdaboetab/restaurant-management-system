const checkoutItemsDiv = document.getElementById("checkout-items");
const checkoutTotalSpan = document.getElementById("checkout-total");
const placeOrderBtn = document.getElementById("place-order-btn");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

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

function renderCheckout() {
  const cart = getCart();
  checkoutItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    checkoutItemsDiv.innerHTML =
      `<p class="text-center text-gray-500">السلة فارغة</p>`;
    placeOrderBtn.disabled = true;
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "flex justify-between text-gray-700";

    div.innerHTML = `
      <span>${item.name} × ${item.quantity}</span>
      <span>${(item.price * item.quantity).toFixed(2)} SAR</span>
    `;

    checkoutItemsDiv.appendChild(div);
  });

  checkoutTotalSpan.textContent = total.toFixed(2);
}

async function placeOrder() {
  const userId = localStorage.getItem("userId");
  const cart = getCart();

  if (cart.length === 0) {
    alert("السلة فارغة!");
    return;
  }


  const orderRequest = {
    customerId: parseInt(userId),
    items: cart.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity
    }))
  };


  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderRequest)
    });

    if (!response.ok) throw new Error("فشل إنشاء الطلب");

    const order = await response.json();
    alert(`تم إنشاء الطلب #${order.id} بنجاح!`);

    // مسح السلة بعد الطلب
    localStorage.removeItem("cart");
    window.location.href = `track-order.html?orderId=${order.id}`;

  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء إرسال الطلب");
  }
}

placeOrderBtn.addEventListener("click", placeOrder);
renderCheckout();
