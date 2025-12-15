const categoriesDiv = document.getElementById("categories");
const menuList = document.getElementById("menu-list");

let menu = [];


// Event delegation for add to cart buttons
menuList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const itemId = e.target.getAttribute("data-id");
    addToCartById(itemId);
  }
});


function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../../auth/login.html";
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
    console.log("Fetching categories...");
    const response = await fetch(
      `${BASE_URL}/api/customer/menu/categories`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const categories = await response.json();
    console.log("Categories loaded:", categories);

    categoriesDiv.innerHTML = "";

    if (categories.length === 0) {
      categoriesDiv.innerHTML = "<p>لا توجد فئات</p>";
      return;
    }

    // Add "All Items" button
    const allBtn = document.createElement("button");
    allBtn.className = "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mr-2";
    allBtn.textContent = "جميع العناصر";
    allBtn.addEventListener("click", () => fetchAllItems());
    categoriesDiv.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className =
        "px-4 py-2 bg-gray-200 rounded hover:bg-green-600 hover:text-white transition";
      btn.textContent = cat.name;

      btn.addEventListener("click", () => {
        console.log("Category clicked:", cat.id);
        fetchItemsByCategory(cat.id);
      });

      categoriesDiv.appendChild(btn);
    });

  } catch (err) {
    console.error("Error fetching categories:", err);
    categoriesDiv.innerHTML = "<p>خطأ في تحميل الفئات</p>";
  }
}

async function fetchAllItems() {
  menuList.innerHTML = "<p>جاري التحميل...</p>";

  try {
    // Fetch all categories first
    const categoriesResponse = await fetch(
      `${BASE_URL}/api/customer/menu/categories`,
      { headers: getAuthHeaders() }
    );

    if (!categoriesResponse.ok) {
      throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
    }

    const categories = await categoriesResponse.json();
    console.log("All categories for fetching items:", categories);

    // Fetch items from all categories
    const allItemsPromises = categories.map(cat =>
      fetch(`${BASE_URL}/api/customer/menu/categories/${cat.id}/items`, {
        headers: getAuthHeaders()
      }).then(res => res.json())
    );

    const allItemsArrays = await Promise.all(allItemsPromises);
    menu = allItemsArrays.flat(); // Flatten all arrays into one

    console.log("All menu items loaded:", menu);
    menuList.innerHTML = "";

    if (menu.length === 0) {
      menuList.innerHTML = "<p>لا توجد عناصر في أي فئة</p>";
      return;
    }

    menu.forEach(item => menuList.appendChild(createMenuCard(item)));

  } catch (err) {
    console.error("Error fetching all items:", err);
    menuList.innerHTML = "<p>خطأ في تحميل العناصر</p>";
  }
}

async function fetchItemsByCategory(categoryId) {
  console.log("Fetching items for category:", categoryId);
  menuList.innerHTML = "<p>جاري التحميل...</p>";

  try {
    const response = await fetch(
      `${BASE_URL}/api/customer/menu/categories/${categoryId}/items`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    menu = await response.json();
    console.log("Menu items loaded for category:", menu);
    menuList.innerHTML = "";

    if (menu.length === 0) {
      menuList.innerHTML = "<p>لا توجد عناصر في هذه الفئة</p>";
      return;
    }

    menu.forEach(item => menuList.appendChild(createMenuCard(item)));

  } catch (err) {
    console.error("Error fetching items by category:", err);
    menuList.innerHTML = "<p>خطأ في تحميل عناصر الفئة</p>";
  }
}



function addToCartById(itemId) {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = menu.find(i => i.id == itemId);
    if (!item) {
      console.error("Item not found in menu:", itemId);
      alert("خطأ: العنصر غير موجود");
      return;
    }

    const existing = cart.find(i => i.id == itemId);
    if (existing) {
      existing.quantity++;
      alert(`تم تحديث الكمية: ${item.name} (الكمية: ${existing.quantity})`);
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
      alert(`تمت إضافة ${item.name} إلى السلة`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart updated:", cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("حدث خطأ في إضافة العنصر إلى السلة");
  }
}

fetchCategories();
// Load all items initially so users can add to cart immediately
fetchAllItems();

