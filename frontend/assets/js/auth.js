/* ===========================
   LOGIN
=========================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    const errorMessage = document.getElementById("errorMessage");
    errorMessage.classList.add("hidden");

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect based on role
      if (data.role === "CUSTOMER") {
        window.location.href = "../customer/menu.html";
      } else if (data.role === "STAFF") {
        window.location.href = "../staff/orders.html";
      } else if (data.role === "ADMIN") {
        window.location.href = "../admin/dashboard.html";
      }
    } catch (error) {
      errorMessage.textContent = "Invalid username or password";
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
    const role = document.getElementById("role").value;

    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    errorMessage.classList.add("hidden");
    successMessage.classList.add("hidden");

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
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
        "Account created successfully. Redirecting to login...";
      successMessage.classList.remove("hidden");

      registerForm.reset();

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } catch (error) {
      errorMessage.textContent =
        "Registration failed. Try another username or email.";
      errorMessage.classList.remove("hidden");
    }
  });
}
