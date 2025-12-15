/* ===========================
   LOGIN
=========================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.classList.add("hidden");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: email, password }),
});

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // Save token, role & userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId); // Store user ID for orders

      // Redirect based on role - paths relative to auth folder where login is
      if (data.role === "CUSTOMER") {
        window.location.href = "../pages/customer/menu.html";
      } else if (data.role === "STAFF") {
        window.location.href = "../pages/staff/update-order.html";
      } else if (data.role === "ADMIN") {
        window.location.href = "../pages/admin/dashboard.html";
      }
    } catch (error) {
      console.error(error); // طباعة الخطأ في الكونسول للمساعدة
      errorMessage.textContent = "اسم المستخدم أو كلمة المرور غير صحيحة";
      errorMessage.classList.remove("hidden");
    }
  });
}

/* ===========================
   REGISTER
=========================== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value; // هنا نحتاج الـ role لأننا ننشئ حساباً جديداً

    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    errorMessage.classList.add("hidden");
    successMessage.classList.add("hidden");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      successMessage.textContent =
        "تم إنشاء الحساب بنجاح! جاري التوجيه لتسجيل الدخول...";
      successMessage.classList.remove("hidden");

      registerForm.reset();

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1500);
    } catch (error) {
      errorMessage.textContent =
        "فشل التسجيل. ربما اسم المستخدم موجود مسبقاً.";
      errorMessage.classList.remove("hidden");
    }
  });
}