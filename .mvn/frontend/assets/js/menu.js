const categoriesDiv = document.getElementById("categories");
const menuList = document.getElementById("menu-list");

let menu = [];


function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../auth/login.html";
    return {};
  }
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function createMenuCard(item) {
  const card = document.createElement("div");
  card.className = "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300";
  card.innerHTML = `
    <h3 class="text-xl font-bold text-gray-800 mb-2">${item.name}</h3>
    <p class="text-gray-600 mb-4">${item.description}</p>
    <p class="text-lg font-bold text-gray-800 mb-4">${item.price.toFixed(2)} SAR</p>
    <button data-id="${item.id}" class="add-to-cart-btn bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
      أضف إلى السلة
    </button>
  `;
  return card;
}

async function fetchCategories() {
  try {
    const response = await fetch(
      `${BASE_URL}/customer/menu/categories`,
      { headers: getAuthHeaders() }
    );

    const categories = await response.json();

    categoriesDiv.innerHTML = "";

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className =
        "px-4 py-2 bg-gray-200 rounded hover:bg-green-600 hover:text-white transition";
      btn.textContent = cat.name;

      btn.addEventListener("click", () => {
        fetchItemsByCategory(cat.id);
      });

      categoriesDiv.appendChild(btn);
    });

  } catch (err) {
    console.error(err);
  }
}

async function fetchItemsByCategory(categoryId) {
  menuList.innerHTML = "<p>جاري التحميل...</p>";

  try {
    const response = await fetch(
      `${BASE_URL}/customer/menu/categories/${categoryId}/items`,
      { headers: getAuthHeaders() }
    );

    menu = await response.json();
    menuList.innerHTML = "";

    if (menu.length === 0) {
      menuList.innerHTML = "<p>لا توجد عناصر</p>";
      return;
    }

    menu.forEach(item => menuList.appendChild(createMenuCard(item)));

    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const itemId = e.target.getAttribute("data-id");
        addToCartById(itemId);
      });
    });

  } catch (err) {
    console.error(err);
  }
}



function addToCartById(itemId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const item = menu.find(i => i.id == itemId);
  if (!item) return;

  const existing = cart.find(i => i.id == itemId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت الإضافة إلى السلة 🛒");
}

fetchCategories();

