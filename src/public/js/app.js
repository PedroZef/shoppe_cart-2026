const API_BASE = '/api/cart';
const cartTbody = document.getElementById('cart-tbody');
const cartEmpty = document.getElementById('cart-empty');
const cartTable = document.getElementById('cart-table');
const sumCount = document.getElementById('sum-count');
const sumTotal = document.getElementById('sum-total');
const addForm = document.getElementById('add-form');
const consoleLogs = document.getElementById('console-logs');
const btnClearCart = document.getElementById('btn-clear-cart');
const btnClearLogs = document.getElementById('btn-clear-logs');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
const toastIcon = document.getElementById('toast-icon');

// Utility: Format currency to pt-BR
const formatBRL = (num) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

// Print operational logs to console code box
let logs = [];
const logAction = (method, path, status, bodyResponse) => {
  const timestamp = new Date().toLocaleTimeString();
  const statusClass = status >= 200 && status < 300 ? 'status-ok' : 'status-error';
  const colorMap = {
    'GET': '#06b6d4',
    'POST': '#10b981',
    'PATCH': '#f59e0b',
    'DELETE': '#ef4444'
  };
  
  const logText = `<span style="color: ${colorMap[method] || '#fff'}">[${method}]</span> <span style="color: #9ca3af;">${path}</span> - Status: <span class="${statusClass}">${status}</span> (${timestamp})\nResponse: ${JSON.stringify(bodyResponse, null, 2)}\n\n`;
  logs.unshift(logText);
  if (logs.length > 10) logs.pop(); // keep last 10 entries
  consoleLogs.innerHTML = logs.join('');
};

// Show Custom Toast
const showToast = (message, isError = false) => {
  toastText.innerText = message;
  toastIcon.innerText = isError ? '❌' : '✔';
  toastIcon.style.color = isError ? 'var(--error)' : 'var(--success)';
  toast.className = 'toast show';
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
};

// Fetch and redraw cart contents
const loadCart = async () => {
  try {
    const response = await fetch(API_BASE);
    const data = await response.json();
    
    logAction('GET', API_BASE, response.status, data);
    
    if (data.items && data.items.length > 0) {
      cartEmpty.style.display = 'none';
      cartTable.style.display = 'table';
      
      cartTbody.innerHTML = data.items.map(item => `
        <tr>
          <td class="product-name">${escapeHTML(item.name)}</td>
          <td>${formatBRL(item.price)}</td>
          <td>
            <div class="qty-control">
              <button class="btn-qty" onclick="changeQuantity('${encodeURIComponent(item.name)}', ${item.quantity - 1})">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="btn-qty" onclick="changeQuantity('${encodeURIComponent(item.name)}', ${item.quantity + 1})">+</button>
            </div>
          </td>
          <td style="font-weight: 600;">${formatBRL(item.subtotal)}</td>
          <td>
            <button class="btn-delete-row" onclick="deleteItem('${encodeURIComponent(item.name)}')">🗑️</button>
          </td>
        </tr>
      `).join('');
    } else {
      cartTbody.innerHTML = '';
      cartEmpty.style.display = 'block';
      cartTable.style.display = 'none';
    }

    sumCount.innerText = data.totalItems || 0;
    sumTotal.innerText = formatBRL(data.totalPrice || 0);

  } catch (err) {
    showToast('Falha ao conectar com a API backend.', true);
    console.error(err);
  }
};

// Add Item Action
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('prod-name').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const quantity = parseInt(document.getElementById('prod-qty').value);

  try {
    const response = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, quantity })
    });
    const result = await response.json();
    
    logAction('POST', `${API_BASE}/items`, response.status, result);
    
    if (response.ok) {
      showToast(result.message || 'Produto adicionado com sucesso!');
      addForm.reset();
      document.getElementById('prod-qty').value = 1;
      loadCart();
    } else {
      showToast(result.message || 'Falha ao adicionar item.', true);
    }
  } catch (err) {
    showToast('Erro de comunicação com o servidor.', true);
    console.error(err);
  }
});

// Update Quantity Action
const changeQuantity = async (name, newQty) => {
  try {
    const response = await fetch(`${API_BASE}/items/${name}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty })
    });
    const result = await response.json();
    
    logAction('PATCH', `${API_BASE}/items/${decodeURIComponent(name)}`, response.status, result);
    
    if (response.ok) {
      showToast(result.message || 'Quantidade atualizada!');
      loadCart();
    } else {
      showToast(result.message || 'Falha ao atualizar quantidade.', true);
    }
  } catch (err) {
    showToast('Erro de comunicação com o servidor.', true);
    console.error(err);
  }
};

// Delete Single Item Action
const deleteItem = async (name) => {
  try {
    const response = await fetch(`${API_BASE}/items/${name}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    
    logAction('DELETE', `${API_BASE}/items/${decodeURIComponent(name)}`, response.status, result);
    
    if (response.ok) {
      showToast(result.message || 'Item removido!');
      loadCart();
    } else {
      showToast(result.message || 'Falha ao remover item.', true);
    }
  } catch (err) {
    showToast('Erro de comunicação com o servidor.', true);
    console.error(err);
  }
};

// Clear Cart Action
btnClearCart.addEventListener('click', async () => {
  if (!confirm('Tem certeza que deseja esvaziar o carrinho?')) return;
  try {
    const response = await fetch(API_BASE, { method: 'DELETE' });
    const result = await response.json();
    
    logAction('DELETE', API_BASE, response.status, result);
    
    if (response.ok) {
      showToast(result.message || 'Carrinho esvaziado!');
      loadCart();
    } else {
      showToast(result.message || 'Falha ao esvaziar carrinho.', true);
    }
  } catch (err) {
    showToast('Erro de comunicação com o servidor.', true);
    console.error(err);
  }
});

// Clear log console box
btnClearLogs.addEventListener('click', () => {
  logs = [];
  consoleLogs.innerText = 'Logs limpos. Aguardando novas ações...';
});

// Helper: escape HTML tags for safety
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Bind functions to window so inline onclick events work correctly
window.changeQuantity = changeQuantity;
window.deleteItem = deleteItem;

// Initial Load
window.addEventListener('DOMContentLoaded', loadCart);
