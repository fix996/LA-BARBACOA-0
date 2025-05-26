// Credenciales de administrador
const ADMIN = {
    user: "admin",
    pass: "admin123"
};

// Función para cargar el menú
function cargarMenu() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [
        { nombre: "Tacos de Barbacoa", descripcion: "Carne tradicional con cebolla y cilantro.", precio: 1500 },
        { nombre: "Asado Argentino", descripcion: "Cortes seleccionados con chimichurri.", precio: 3000 }
    ];
    
    const contenedor = document.getElementById('platos-container');
    if (contenedor) {
        contenedor.innerHTML = productos.map(plato => `
            <div class="plato">
                <h3>${plato.nombre}</h3>
                <p>${plato.descripcion}</p>
                <p class="precio">$${plato.precio} ARS</p>
            </div>
        `).join('');
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    const toggleBtn = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => menu.classList.toggle('active'));
    }

    // Login
    const loginForm = document.getElementById('loginAdminForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = document.getElementById('adminUser').value;
            const pass = document.getElementById('adminPass').value;
            const errorMsg = document.getElementById('loginAdminError');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Animación de carga
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                if (user === ADMIN.user && pass === ADMIN.pass) {
                    localStorage.setItem('adminAuth', 'true');
                    window.location.href = 'admin.html';
                } else {
                    errorMsg.textContent = 'Credenciales incorrectas';
                    errorMsg.style.display = 'block';
                    loginForm.classList.add('shake');
                    setTimeout(() => loginForm.classList.remove('shake'), 500);
                    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Ingresar';
                    submitBtn.disabled = false;
                }
            }, 800);
        });
    }

    cargarMenu();
});