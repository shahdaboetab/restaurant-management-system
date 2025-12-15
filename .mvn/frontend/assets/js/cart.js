const cartItemsDiv = document.getElementById("cart-items");
const totalPriceSpan = document.getElementById("total-price");
const cartSummary = document.getElementById("cart-summary");
const emptyCartMsg = document.getElementById("empty-cart");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const cart = getCart();
  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartSummary.classList.add("hidden");
    emptyCartMsg.classList.remove("hidden");
    return;
  }

  emptyCartMsg.classList.add("hidden");
  cartSummary.classList.remove("hidden");

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded-lg shadow flex justify-between items-center";

    div.innerHTML = `
      <div>
        <h3 class="font-bold text-lg">${item.name}</h3>
        <p class="text-gray-600">${item.price} SAR</p>
      </div>

      <div class="flex items-center space-x-3">
        <button onclick="updateQty(${index}, -1)"
          class="bg-gray-200 px-3 py-1 rounded">-</button>

        <span class="font-bold">${item.quantity}</span>

        <button onclick="updateQty(${index}, 1)"
          class="bg-gray-200 px-3 py-1 rounded">+</button>

        <button onclick="removeItem(${index})"
          class="text-red-600 ml-4">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    cartItemsDiv.appendChild(div);
  });

  totalPriceSpan.textContent = calculateTotal(cart).toFixed(2);
}

function updateQty(index, change) {
  const cart = getCart();
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

renderCart();
