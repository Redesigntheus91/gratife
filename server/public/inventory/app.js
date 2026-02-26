const API_BASE = '/api/items';

function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

let presets = [
  { title: 'Subtotal', qty: 1 },
  { title: 'Eggs', qty: 12 },
  { title: 'Donation', qty: 1 },
  { title: 'Pineapple', qty: 1 }
];

function showLogin(show) {
  const screen = document.getElementById('login-screen');
  screen.classList.toggle('hidden', !show);
}

function isAuthed() { return localStorage.getItem('inventory_authed') === '1'; }

function logout() { localStorage.removeItem('inventory_authed'); renderAuth(); }

function renderAuth() {
  if (isAuthed()) {
    showLogin(false);
    document.getElementById('app').classList.remove('hidden');
  } else {
    showLogin(true);
    document.getElementById('app').classList.add('hidden');
  }
}

async function fetchItems() {
  const res = await fetch(API_BASE);
  return res.json();
}

async function addItem(item) {
  const res = await fetch(API_BASE, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return res.json();
}

async function updateItem(id, patch) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  return res.json();
}

async function deleteItem(id) {
  await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
}

function renderTotal(items) {
  const total = items.reduce((s, it) => s + (it.qty || 0), 0);
  document.getElementById('total-count').textContent = total;
}

function createItemElement(item) {
  const el = document.createElement('div');
  el.className = 'item';
  el.innerHTML = `
    <div>
      <div class="item-name">${escapeHtml(item.title)}</div>
      <div class="item-meta">id: ${item.id}</div>
    </div>
    <div class="item-controls">
      <button class="qty-btn dec">-</button>
      <div class="qty-display">${item.qty}</div>
      <button class="qty-btn inc">+</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  el.querySelector('.inc').addEventListener('click', async () => {
    item.qty = (item.qty || 0) + 1;
    await updateItem(item.id, { qty: item.qty });
    loadAndRender();
  });
  el.querySelector('.dec').addEventListener('click', async () => {
    item.qty = Math.max(0, (item.qty || 0) - 1);
    await updateItem(item.id, { qty: item.qty });
    loadAndRender();
  });
  el.querySelector('.delete-btn').addEventListener('click', async () => {
    if (confirm('Delete item?')) { await deleteItem(item.id); loadAndRender(); }
  });

  return el;
}

function escapeHtml(str) {
  return (str + '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]);
}

async function loadAndRender() {
  const items = await fetchItems();
  const list = document.getElementById('items-list');
  list.innerHTML = '';
  if (!items.length) { list.innerHTML = '<div class="empty">No items yet</div>'; }
  items.forEach(it => list.appendChild(createItemElement(it)));
  renderTotal(items);
}

async function quickAdd(preset) {
  await addItem({ title: preset.title, qty: preset.qty });
  await loadAndRender();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('password').value;
    if (pw === 'letmein') { localStorage.setItem('inventory_authed','1'); renderAuth(); }
    else { document.getElementById('login-error').textContent = 'Wrong password'; }
  });

  document.getElementById('logout').addEventListener('click', logout);

  const grid = document.getElementById('preset-grid');
  presets.forEach(p => {
    const b = document.createElement('button');
    b.className = 'quick-btn';
    b.textContent = `${p.title} (${p.qty})`;
    b.addEventListener('click', () => quickAdd(p));
    grid.appendChild(b);
  });

  renderAuth();
  if (isAuthed()) loadAndRender();
});
