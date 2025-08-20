// Variables globales
let products = {};
let modalOpen = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Función de inicialización
function initializeApp() {
  // Cargar productos
  loadProducts();
  
  // Configurar event listeners
  setupEventListeners();
  
  // Renderizar menú inicial
  renderMenu("Pizzas");
}

// Cargar productos desde localStorage
function loadProducts() {
  const defaultProducts = {
    "Pizzas": [
      { name: "Pizza Muzza", price: 15000 },
      { name: "Pizza Napolitana", price: 18000 }
    ],
    "Parrilla": [
      { name: "Asado de tira", price: 22000 },
      { name: "Choripán", price: 17000},
    ],
    "Bebidas": [
      { name: "Coca-Cola 1.5L", price: 4500 },
      { name: "Cerveza Quilmes", price: 6000 }
    ],
    "Postres": [
      { name: "Flan Casero", price: 6000 },
      { name: "Helado", price: 6500 }
    ]
  };
  
  const storedProducts = localStorage.getItem("products");
  products = storedProducts ? JSON.parse(storedProducts) : defaultProducts;
}

// Configurar todos los event listeners
function setupEventListeners() {
  // Navbar toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.getElementById('overlay');
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    overlay.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Cerrar menú al hacer clic en un enlace (en móviles)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });

  // Cerrar menú al hacer clic en el overlay
  overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  });

  // Cambiar categoría en menú principal
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMenu(btn.dataset.category);
    });
  });

  // Cambiar categoría en panel de admin
  document.querySelectorAll(".admin-category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderAdminItems(btn.dataset.category);
    });
  });

  // Login
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const adminSection = document.getElementById("admin");
  const loginSection = document.getElementById("login");

  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    if (email === "admin@barbacoa.com" && pass === "1234") {
      adminSection.classList.remove("hidden");
      loginSection.classList.add("hidden");
      loginError.textContent = "";
      // Renderizar productos en panel admin
      renderAdminItems("Pizzas");
    } else {
      loginError.textContent = "❌ Usuario o contraseña incorrectos";
    }
  });

  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    adminSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    document.getElementById("login-form").reset();
  });

  // Agregar producto
  document.getElementById("product-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("product-name").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const category = document.getElementById("product-category").value;
    
    if (!name || !price || !category) {
      alert("Por favor, complete todos los campos");
      return;
    }

    if (!products[category]) products[category] = [];
    products[category].push({ name, price });
    localStorage.setItem("products", JSON.stringify(products));

    // Actualizar vista en admin
    const activeCategory = document.querySelector(".admin-category-btn.active").dataset.category;
    if (activeCategory === category) {
      renderAdminItems(category);
    }
    
    // Actualizar menú principal si coincide la categoría
    const menuActiveCategory = document.querySelector(".category-btn.active").dataset.category;
    if (menuActiveCategory === category) {
      renderMenu(category);
    }

    e.target.reset();
    alert("Producto agregado exitosamente!");
  });

  // Cerrar modal de edición
  document.querySelector(".close-modal").addEventListener("click", closeModal);
  document.getElementById("cancel-edit").addEventListener("click", closeModal);

  // Editar producto
  document.getElementById("edit-form").addEventListener("submit", e => {
    e.preventDefault();
    const [category, index] = document.getElementById("edit-index").value.split(",");
    const name = document.getElementById("edit-name").value;
    const price = parseFloat(document.getElementById("edit-price").value);
    const newCategory = document.getElementById("edit-category").value;
    
    // Si la categoría cambió, mover el producto
    if (category !== newCategory) {
      // Eliminar de la categoría anterior
      products[category].splice(parseInt(index), 1);
      // Agregar a la nueva categoría
      if (!products[newCategory]) products[newCategory] = [];
      products[newCategory].push({ name, price });
    } else {
      // Actualizar en la misma categoría
      products[category][parseInt(index)] = { name, price };
    }
    
    localStorage.setItem("products", JSON.stringify(products));
    
    // Actualizar vistas
    const activeAdminCategory = document.querySelector(".admin-category-btn.active").dataset.category;
    renderAdminItems(activeAdminCategory);
    
    const activeMenuCategory = document.querySelector(".category-btn.active").dataset.category;
    if (activeMenuCategory === category || activeMenuCategory === newCategory) {
      renderMenu(activeMenuCategory);
    }
    
    closeModal();
    alert("Producto actualizado exitosamente!");
  });

  // Botón de emergencia para cerrar modales
  document.getElementById('emergency-close').addEventListener('click', closeAllModals);

  // Cerrar modal al hacer clic fuera del contenido
  document.getElementById('edit-modal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // Prevenir que el modal cierre al hacer clic dentro del contenido
  document.querySelector('.modal-content').addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

// Render productos del menú
function renderMenu(category) {
  const container = document.getElementById("menu-items");
  container.innerHTML = "";
  
  if (products[category] && products[category].length > 0) {
    products[category].forEach(item => {
      const div = document.createElement("div");
      div.classList.add("menu-item");
      div.innerHTML = `<h3>${item.name}</h3><p>$${item.price.toLocaleString('es-AR')} ARS</p>`;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = '<p class="no-items">No hay productos en esta categoría</p>';
  }
}

// Render productos en panel de admin
function renderAdminItems(category) {
  const container = document.getElementById("admin-items");
  container.innerHTML = "";
  
  if (products[category] && products[category].length > 0) {
    products[category].forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("admin-item");
      div.innerHTML = `
        <h3>${item.name}</h3>
        <p>$${item.price.toLocaleString('es-AR')} ARS</p>
        <div class="admin-item-controls">
          <button class="edit-btn" data-category="${category}" data-index="${index}">Editar</button>
          <button class="delete-btn" data-category="${category}" data-index="${index}">Eliminar</button>
        </div>
      `;
      container.appendChild(div);
    });
    
    // Añadir event listeners a los botones
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        const index = parseInt(e.target.dataset.index);
        openEditModal(category, index);
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        const index = parseInt(e.target.dataset.index);
        deleteProduct(category, index);
      });
    });
  } else {
    container.innerHTML = '<p class="no-items">No hay productos en esta categoría</p>';
  }
}

// Abrir modal de edición
function openEditModal(category, index) {
  const product = products[category][index];
  document.getElementById("edit-index").value = `${category},${index}`;
  document.getElementById("edit-name").value = product.name;
  document.getElementById("edit-price").value = product.price;
  document.getElementById("edit-category").value = category;
  
  // Mostrar modal y overlay
  document.getElementById("edit-modal").classList.remove("hidden");
  document.getElementById("overlay").style.display = "block";
  document.getElementById("emergency-close").style.display = "block";
  document.body.style.overflow = "hidden";
  
  modalOpen = true;
}

// Cerrar modal
function closeModal() {
  document.getElementById("edit-modal").classList.add("hidden");
  document.getElementById("overlay").style.display = "none";
  document.getElementById("emergency-close").style.display = "none";
  document.body.style.overflow = "";
  
  modalOpen = false;
}

// Cerrar todos los modales (función de emergencia)
function closeAllModals() {
  document.getElementById("edit-modal").classList.add("hidden");
  document.getElementById("overlay").style.display = "none";
  document.getElementById("emergency-close").style.display = "none";
  document.body.style. overflow = "";
  
  // También cerrar el menú móvil si está abierto
  const navLinks = document.querySelector('.nav-links');
  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
  }
  
  modalOpen = false;
}

// Eliminar producto
function deleteProduct(category, index) {
  if (confirm("¿Está seguro de que desea eliminar este producto?")) {
    products[category].splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    
    // Actualizar vistas
    const activeAdminCategory = document.querySelector(".admin-category-btn.active").dataset.category;
    renderAdminItems(activeAdminCategory);
    
    const activeMenuCategory = document.querySelector(".category-btn.active").dataset.category;
    if (activeMenuCategory === category) {
      renderMenu(category);
    }
    
    alert("Producto eliminado exitosamente!");
  }
}

// Permitir cerrar modales con la tecla Escape
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape" && modalOpen) {
    closeModal();
  }
});

// Mejorar el desplazamiento suave para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });

});
