// تحميل النافبار المناسب حسب الدور
function loadNavbar() {
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName") || "مستخدم";

  // إخفاء كل النافبارات
  document
    .getElementById("customerNavbar")
    ?.style.setProperty("display", "none");
  document.getElementById("staffNavbar")?.style.setProperty("display", "none");
  document.getElementById("adminNavbar")?.style.setProperty("display", "none");

  // إظهار النافبار المناسب
  if (userRole === "customer") {
    document.getElementById("customerNavbar").style.display = "block";
    document.getElementById("userName").textContent = `مرحباً، ${userName}`;
    updateCartCount();
  } else if (userRole === "staff") {
    document.getElementById("staffNavbar").style.display = "block";
    document.getElementById("staffName").textContent = `مرحباً، ${userName}`;
  } else if (userRole === "admin") {
    document.getElementById("adminNavbar").style.display = "block";
    document.getElementById("adminName").textContent = `مرحباً، ${userName}`;
  }
}

// تحديث عدد المنتجات في السلة
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}

// تحميل النافبار عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", loadNavbar);
