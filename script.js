// Carga dinámica del menú desde localStorage
function cargarMenu() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [
        { nombre: "Tacos de Barbacoa", descripcion: "Carne tradicional con cebolla y cilantro.", precio: 1500 },
        { nombre: "Asado Argentino", descripcion: "Cortes seleccionados con chimichurri.", precio: 3000 }
    ];
    
    const contenedor = document.getElementById('platos-container');
    contenedor.innerHTML = "";
    
    productos.forEach(plato => {
        contenedor.innerHTML += `
            <div class="plato">
                <h3>${plato.nombre}</h3>
                <p>${plato.descripcion}</p>
                <p class="precio">$${plato.precio} ARS</p>
            </div>
        `;
    });
}

// Navbar móvil
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = document.getElementById('usuario').value;
            const contrasena = document.getElementById('password').value;

            if (usuario === "admin" && contrasena === "admin123") {
                window.location.href = "admin.html";
            } else {
                document.getElementById('error-login').style.display = 'block';
            }
        });
    }

    cargarMenu();
});
// Agrega esto al final de tu public.js
document.addEventListener('DOMContentLoaded', function() {
    // Efecto hover para los botones
    const buttons = document.querySelectorAll('button, .btn-login');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Animación para el formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Agrega animación de carga
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
            submitBtn.disabled = true;
            
            // Simula verificación (en producción sería una llamada real)
            setTimeout(() => {
                const usuario = document.getElementById('usuario').value;
                const contrasena = document.getElementById('password').value;
                
                if (usuario === "admin" && contrasena === "admin123") {
                    window.location.href = "admin.html";
                } else {
                    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Ingresar';
                    submitBtn.disabled = false;
                    document.getElementById('error-login').style.display = 'block';
                    
                    // Animación de error
                    loginForm.classList.add('shake');
                    setTimeout(() => {
                        loginForm.classList.remove('shake');
                    }, 500);
                }
            }, 1000);
        });
    }
});// Credenciales válidas (cámbialas luego)
const ADMIN_CREDENTIALS = {
    user: "admin",
    pass: "admin123"
};

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = document.getElementById('inputUser').value;
            const password = document.getElementById('inputPassword').value;
            const errorElement = document.getElementById('loginError');
            const loginButton = document.getElementById('loginButton');
            
            // Mostrar estado de carga
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
            loginButton.disabled = true;
            
            // Simular validación (en producción sería una llamada real)
            setTimeout(() => {
                if (user === ADMIN_CREDENTIALS.user && password === ADMIN_CREDENTIALS.pass) {
                    // Guardar estado de login
                    sessionStorage.setItem('isAuthenticated', 'true');
                    // Redirigir al panel admin
                    window.location.href = 'admin.html';
                } else {
                    // Mostrar error
                    errorElement.textContent = 'Credenciales incorrectas';
                    errorElement.style.display = 'block';
                    loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Ingresar';
                    loginButton.disabled = false;
                    
                    // Animación de error
                    loginForm.classList.add('shake');
                    setTimeout(() => {
                        loginForm.classList.remove('shake');
                    }, 500);
                }
            }, 800); // Retraso simulado
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (sessionStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Configurar logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('isAuthenticated');
        window.location.href = 'index.html';
    });

    // Resto de tu lógica de admin...
});