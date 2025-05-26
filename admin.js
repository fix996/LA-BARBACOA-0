// Verificar autenticación al cargar
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('adminAuth') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('adminAuth');
        window.location.href = 'index.html';
    });

    // Gestión de productos
    function mostrarProductos() {
        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        const lista = document.getElementById("lista-productos");
        if (lista) {
            lista.innerHTML = productos.map((producto, index) => `
                <div class="plato">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">$${producto.precio} ARS</p>
                    <button onclick="eliminarProducto(${index})">Eliminar</button>
                </div>
            `).join('');
        }
    }

    window.eliminarProducto = function(index) {
        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos.splice(index, 1);
        localStorage.setItem("productos", JSON.stringify(productos));
        mostrarProductos();
    };

    document.getElementById('form-producto')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos.push({
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            precio: document.getElementById('precio').value
        });
        localStorage.setItem("productos", JSON.stringify(productos));
        mostrarProductos();
        this.reset();
    });

    mostrarProductos();
});