/* ==========
   UTIL / STATE
========== */
const qs = (s, sc=document)=>sc.querySelector(s);
const qsa = (s, sc=document)=>[...sc.querySelectorAll(s)];

const STORAGE_KEYS = {
  products: 'bbq_products',
  isAdmin: 'bbq_is_admin'
};

const DEMO_PRODUCTS = [
  {
    id: crypto.randomUUID(),
    name: 'BBQ Burger',
    desc: 'Carne smash, cheddar, cebolla crispy, pepinillos y salsa BBQ.',
    price: 9.99,
    category: 'burgers',
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349'
  },
  {
    id: crypto.randomUUID(),
    name: 'Costillas BBQ',
    desc: 'Cocinadas a fuego lento con glaze de barbacoa casera.',
    price: 14.99,
    category: 'ribs',
    img: 'https://images.unsplash.com/photo-1606755962773-d324e0a13026'
  },
  {
    id: crypto.randomUUID(),
    name: 'Papas Cajún',
    desc: 'Corte clásico, especias cajún y alioli de ajo asado.',
    price: 4.49,
    category: 'sides',
    img: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f'
  },
  {
    id: crypto.randomUUID(),
    name: 'Milkshake Vainilla',
    desc: 'Helado artesanal, crema batida y sirope.',
    price: 4.99,
    category: 'drinks',
    img: 'https://images.unsplash.com/photo-1625861917138-13a7a2f5e5a2'
  },
  {
    id: crypto.randomUUID(),
    name: 'Doble Smash',
    desc: 'Doble carne smash, doble cheddar y salsa especial.',
    price: 11.99,
    category: 'burgers',
    img: 'https://images.unsplash.com/photo-1601924928376-3cc3b37d8a12'
  }
];

function getProducts(){
  const raw = localStorage.getItem(STORAGE_KEYS.products);
  return raw ? JSON.parse(raw) : [];
}
function setProducts(arr){
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(arr));
}
function ensureSeed(){
  if(getProducts().length === 0){ setProducts(DEMO_PRODUCTS); }
}
function isAdmin(){
  return localStorage.getItem(STORAGE_KEYS.isAdmin) === 'true';
}
function setAdmin(flag){
  localStorage.setItem(STORAGE_KEYS.isAdmin, flag ? 'true' : 'false');
}

/* ==========
   NAV / DRAWER
========== */
const drawer = qs('#drawer');
const burgerBtn = qs('#hamburger');
const loginLink = qs('#loginLink');
const adminLink = qs('#adminLink');
const logoutBtn = qs('#logoutBtn');

function setDrawer(open){
  drawer.classList.toggle('open', !!open);
  burgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
}
burgerBtn.addEventListener('click', ()=> setDrawer(!drawer.classList.contains('open')));
qsa('.drawer-link').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const goto = a.dataset.goto;
    if (goto) { showSection(goto); }
    setDrawer(false);
  });
});

function syncNav(){
  if(isAdmin()){
    adminLink.hidden = false;
    logoutBtn.hidden = false;
    loginLink.textContent = 'Sesión iniciada';
    loginLink.style.pointerEvents = 'none';
    loginLink.style.opacity = .6;
  }else{
    adminLink.hidden = true;
    logoutBtn.hidden = true;
    loginLink.textContent = 'Inicio de sesión';
    loginLink.style.pointerEvents = 'auto';
    loginLink.style.opacity = 1;
  }
}
logoutBtn.addEventListener('click', ()=>{
  setAdmin(false);
  syncNav();
  showSection('inicio');
});

/* ==========
   SECCIONES (SPA simple)
========== */
const sections = qsa('main > .section');
function showSection(id){
  sections.forEach(s=> s.style.display = (s.id === id) ? 'block' : 'none');
  // scroll a top para mejor UX
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function initSections(){
  sections.forEach(s=> s.style.display = 'none');
  showSection('inicio');
}

/* ==========
   MENÚ / LISTADO DE PRODUCTOS
========== */
const grid = qs('#productsGrid');
const filterChips = qsa('.chip');

function renderMenu(filter='all'){
  const data = getProducts();
  grid.innerHTML = '';
  const filtered = data.filter(p => filter === 'all' ? true : p.category === filter);

  if(filtered.length === 0){
    grid.innerHTML = `<div class="card muted">Sin productos en esta categoría.</div>`;
    return;
  }

  filtered.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product card';
    card.innerHTML = `
      <img class="thumb" src="${p.img}" alt="${p.name}"/>
      <div>
        <div class="meta">
          <h3>${p.name}</h3>
          <div class="price">$${Number(p.price).toFixed(2)}</div>
        </div>
        <p class="muted small">${p.desc}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

filterChips.forEach(ch=>{
  ch.addEventListener('click', ()=>{
    filterChips.forEach(c=>c.classList.remove('active'));
    ch.classList.add('active');
    renderMenu(ch.dataset.filter);
  });
});

/* ==========
   LOGIN (DEMO)
========== */
const loginForm = qs('#loginForm');
const loginMsg = qs('#loginMsg');

loginForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const user = qs('#user').value.trim();
  const pass = qs('#pass').value.trim();

  if(user === 'admin' && pass === '1234'){
    setAdmin(true);
    loginMsg.textContent = 'Ingreso correcto. Redirigiendo...';
    loginMsg.className = 'msg ok';
    syncNav();
    setTimeout(()=> showSection('admin'), 400);
  }else{
    loginMsg.textContent = 'Usuario o contraseña incorrectos.';
    loginMsg.className = 'msg err';
  }
});

/* ==========
   ADMIN: CRUD
========== */
const adminTable = qs('#adminTable');
const seedBtn = qs('#seedBtn');

const form = qs('#productForm');
const idInput = qs('#productId');
const nameInput = qs('#name');
const priceInput = qs('#price');
const catInput = qs('#category');
const descInput = qs('#desc');
const imgInput = qs('#img');
const formMsg = qs('#formMsg');
const cancelEditBtn = qs('#cancelEdit');
const saveBtn = qs('#saveBtn');

function adminGuard(){
  if(!isAdmin()){
    showSection('login');
    return false;
  }
  return true;
}

function renderAdminTable(){
  if(!adminGuard()) return;
  const data = getProducts();
  adminTable.innerHTML = '';
  if(data.length === 0){
    adminTable.innerHTML = `<div class="card muted">No hay productos. Presioná "Cargar ejemplos" o agregá uno.</div>`;
    return;
  }
  data.forEach(p=>{
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `
      <img src="${p.img}" alt="${p.name}"/>
      <div><strong>${p.name}</strong><div class="muted small">${p.category}</div></div>
      <div class="muted small">${p.desc}</div>
      <div><strong>$${Number(p.price).toFixed(2)}</strong></div>
      <div class="row-actions">
        <button class="btn small" data-edit="${p.id}">Editar</button>
        <button class="btn small danger" data-del="${p.id}">Borrar</button>
      </div>
    `;
    adminTable.appendChild(row);
  });

  // acciones
  qsa('[data-edit]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-edit');
      startEdit(id);
    });
  });
  qsa('[data-del]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-del');
      delProduct(id);
    });
  });
}

seedBtn?.addEventListener('click', ()=>{
  setProducts(DEMO_PRODUCTS);
  renderAdminTable();
  renderMenu(qs('.chip.active')?.dataset.filter || 'all');
});

function resetForm(){
  form.reset();
  idInput.value = '';
  cancelEditBtn.hidden = true;
  saveBtn.textContent = 'Guardar';
  formMsg.textContent = '';
  formMsg.className = 'msg';
}

function startEdit(id){
  const data = getProducts();
  const p = data.find(x=>x.id === id);
  if(!p) return;
  idInput.value = p.id;
  nameInput.value = p.name;
  priceInput.value = p.price;
  catInput.value = p.category;
  descInput.value = p.desc;
  imgInput.value = p.img;
  cancelEditBtn.hidden = false;
  saveBtn.textContent = 'Actualizar';
  showSection('admin');
  formMsg.textContent = 'Editando producto…';
  formMsg.className = 'msg';
}

cancelEditBtn?.addEventListener('click', (e)=>{
  e.preventDefault();
  resetForm();
});

function delProduct(id){
  if(!confirm('¿Eliminar producto?')) return;
  const data = getProducts().filter(p=> p.id !== id);
  setProducts(data);
  renderAdminTable();
  renderMenu(qs('.chip.active')?.dataset.filter || 'all');
}

form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!adminGuard()) return;

  const payload = {
    id: idInput.value || crypto.randomUUID(),
    name: nameInput.value.trim(),
    desc: descInput.value.trim(),
    price: parseFloat(priceInput.value),
    category: catInput.value,
    img: imgInput.value.trim()
  };

  if(!payload.name || isNaN(payload.price) || !payload.img){
    formMsg.textContent = 'Completá nombre, precio e imagen válidos.';
    formMsg.className = 'msg err';
    return;
  }

  const data = getProducts();
  const idx = data.findIndex(p=>p.id === payload.id);
  if(idx >= 0){ data[idx] = payload; } else { data.unshift(payload); }
  setProducts(data);

  formMsg.textContent = idx >= 0 ? 'Producto actualizado.' : 'Producto agregado.';
  formMsg.className = 'msg ok';

  renderAdminTable();
  renderMenu(qs('.chip.active')?.dataset.filter || 'all');
  resetForm();
});

/* ==========
   INIT
========== */
function init(){
  ensureSeed();
  initSections();
  syncNav();
  renderMenu('all');
  // Admin: si ya está logueado y entra al panel
  if(isAdmin()){
    showSection('admin');
    renderAdminTable();
  }
  // Navegar por hash (? opcional)
  window.addEventListener('hashchange', ()=>{
    const id = location.hash.replace('#','');
    if(id){ showSection(id); if(id==='admin'){ renderAdminTable(); } }
  });
}
document.addEventListener('DOMContentLoaded', init);
