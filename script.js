// Menú hamburguesa
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
});

// Cambiar secciones
const links = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("main section");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("data-section");

    sections.forEach(section => {
      section.classList.remove("active");
      if (section.id === target) {
        section.classList.add("active");
      }
    });

    navMenu.style.display = "none"; // cerrar menú después de click
  });
});

// Lista de productos
let products = JSON.parse(localStorage.getItem("products")) || [
  { name: "BBQ Burger", price: 9.99 },
  { name: "Costillas BBQ", price: 14.99 }
];

const productList = document.getElementById("product-list");

function renderProducts() {
  productList.innerHTML = "";
  products.forEach((p, index) => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <strong>${p.name}</strong> - $${p.price}
      ${isAdmin ? `<button onclick="deleteProduct(${index})">❌</button>` : ""}
    `;
    productList.appendChild(div);
  });
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

let isAdmin = false;

// Login
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "1234") {
    isAdmin = true;
    loginStatus.textContent = "Modo administrador activado ✅";
    loginStatus.style.color = "lightgreen";
    renderProducts();
    addAdminControls();
  } else {
    loginStatus.textContent = "Credenciales incorrectas ❌";
    loginStatus.style.color = "red";
  }
});

function addAdminControls() {
  const addBtn = document.createElement("button");
  addBtn.textContent = "Agregar producto";
  addBtn.onclick = () => {
    const name = prompt("Nombre del producto:");
    const price = parseFloat(prompt("Precio del producto:"));
    if (name && !isNaN(price)) {
      products.push({ name, price });
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
    }
  };
  productList.parentNode.insertBefore(addBtn, productList);
}

// Render inicial
renderProducts();
