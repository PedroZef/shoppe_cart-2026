import readline from 'readline';
import Cart from './services/cart.js';
import Item from './services/item.js';

const BACKEND_URL = 'http://localhost:3001/api/cart';
let isApiMode = false;
let localCart = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

// ANSI Color codes for clean and attractive terminal visuals
const colors = {
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
  magenta: '\x1b[35m'
};

async function checkBackendConnection() {
  try {
    const res = await fetch(BACKEND_URL, { signal: AbortSignal.timeout(1000) });
    if (res.ok) {
      isApiMode = true;
      localCart = null;
      return true;
    }
  } catch (err) {
    // Fail silently, will fall back to local cart
  }
  isApiMode = false;
  if (!localCart) {
    localCart = new Cart();
  }
  return false;
}

async function getCartData() {
  if (isApiMode) {
    const res = await fetch(BACKEND_URL);
    if (!res.ok) throw new Error('Não foi possível obter dados do carrinho.');
    return await res.json();
  } else {
    return {
      items: localCart.listItems(),
      totalItems: localCart.getTotalItems(),
      totalPrice: localCart.getTotal()
    };
  }
}

async function renderCart() {
  console.clear();
  console.log(`\n${colors.cyan}================================================================${colors.reset}`);
  console.log(`${colors.cyan}    🛒  SHOPPE CAR - CARRINHO DE COMPRAS (SIMULADOR DE BACKEND)  ${colors.reset}`);
  console.log(`${colors.cyan}================================================================${colors.reset}`);
  
  if (isApiMode) {
    console.log(`${colors.green}🟢 MODO CONECTADO: Backend API ativo em http://localhost:3000${colors.reset}`);
  } else {
    console.log(`${colors.yellow}🟡 MODO LOCAL: Backend offline. Executando lógica local no CLI.${colors.reset}`);
  }
  console.log(`----------------------------------------------------------------`);

  try {
    const data = await getCartData();
    if (data.items.length === 0) {
      console.log(`\n          Seu carrinho está vazio no momento. 🛍️\n`);
    } else {
      // Table Header
      console.log(
        `${colors.bold}${'Produto'.padEnd(20)} | ${'Preço Unit.'.padEnd(12)} | ${'Qtd'.padEnd(5)} | ${'Subtotal'.padEnd(12)}${colors.reset}`
      );
      console.log(`----------------------------------------------------------------`);
      
      // Table Rows
      data.items.forEach(item => {
        const nameCol = item.name.length > 18 ? item.name.substring(0, 15) + '...' : item.name;
        const priceStr = formatCurrency(item.price);
        const subtotalStr = formatCurrency(item.subtotal);
        console.log(
          `${nameCol.padEnd(20)} | ${priceStr.padEnd(12)} | ${String(item.quantity).padEnd(5)} | ${subtotalStr.padEnd(12)}`
        );
      });
      console.log(`----------------------------------------------------------------`);
      const totalStr = formatCurrency(data.totalPrice);
      console.log(
        `${colors.bold}${'TOTAL DE ITENS:'.padEnd(15)} ${colors.cyan}${data.totalItems}${colors.reset} ${''.padEnd(10)} ${colors.bold}${'TOTAL GERAL:'.padEnd(12)} ${colors.green}${totalStr}${colors.reset}`
      );
    }
  } catch (error) {
    console.log(`${colors.red}❌ Erro ao listar itens: ${error.message}${colors.reset}`);
  }
  console.log(`----------------------------------------------------------------\n`);
}

async function handleAddItem() {
  console.log(`${colors.bold}➕ ADICIONAR PRODUTO AO CARRINHO${colors.reset}`);
  const name = await question('Nome do produto: ');
  const priceInput = await question('Preço unitário (ex: 49.90): ');
  const qtyInput = await question('Quantidade (padrão 1): ');

  // Parse input
  const normalizedPrice = priceInput.replace(',', '.');
  const price = priceInput.trim() === '' ? NaN : Number(normalizedPrice);
  const quantity = qtyInput.trim() === '' ? 1 : Number(qtyInput);

  try {
    if (isApiMode) {
      const res = await fetch(`${BACKEND_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, quantity })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao adicionar item.');
      }
      console.log(`\n${colors.green}✔ ${data.message}${colors.reset}`);
    } else {
      const item = new Item(name, price, quantity);
      localCart.addItem(item);
      console.log(`\n${colors.green}✔ Produto "${item.name}" adicionado com sucesso localmente!${colors.reset}`);
    }
  } catch (error) {
    console.log(`\n${colors.red}❌ Erro: ${error.message}${colors.reset}`);
  }
  await question('\nPressione ENTER para voltar ao menu principal...');
}

async function handleUpdateQuantity() {
  console.log(`${colors.bold}✏️ MODIFICAR QUANTIDADE DE PRODUTO${colors.reset}`);
  const name = await question('Nome exato do produto a modificar: ');
  const qtyInput = await question('Nova quantidade (digite 0 para remover): ');
  const quantity = qtyInput.trim() === '' ? NaN : Number(qtyInput);

  try {
    if (isApiMode) {
      const res = await fetch(`${BACKEND_URL}/items/${encodeURIComponent(name)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao modificar quantidade.');
      }
      console.log(`\n${colors.green}✔ ${data.message}${colors.reset}`);
    } else {
      localCart.updateQuantity(name, quantity);
      console.log(`\n${colors.green}✔ Quantidade de "${name}" atualizada com sucesso localmente!${colors.reset}`);
    }
  } catch (error) {
    console.log(`\n${colors.red}❌ Erro: ${error.message}${colors.reset}`);
  }
  await question('\nPressione ENTER para voltar ao menu principal...');
}

async function handleRemoveItem() {
  console.log(`${colors.bold}❌ REMOVER PRODUTO DO CARRINHO${colors.reset}`);
  const name = await question('Nome do produto a remover: ');

  try {
    if (isApiMode) {
      const res = await fetch(`${BACKEND_URL}/items/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao remover item.');
      }
      console.log(`\n${colors.green}✔ ${data.message}${colors.reset}`);
    } else {
      localCart.removeItem(name);
      console.log(`\n${colors.green}✔ Produto "${name}" removido com sucesso localmente!${colors.reset}`);
    }
  } catch (error) {
    console.log(`\n${colors.red}❌ Erro: ${error.message}${colors.reset}`);
  }
  await question('\nPressione ENTER para voltar ao menu principal...');
}

async function handleClearCart() {
  const confirm = await question(`${colors.yellow}⚠️ Tem certeza que deseja esvaziar o carrinho? (S/N): ${colors.reset}`);
  if (confirm.toLowerCase() !== 's') {
    console.log('\nOperação cancelada.');
    await question('\nPressione ENTER para voltar...');
    return;
  }

  try {
    if (isApiMode) {
      const res = await fetch(BACKEND_URL, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao esvaziar carrinho.');
      console.log(`\n${colors.green}✔ ${data.message}${colors.reset}`);
    } else {
      localCart.clear();
      console.log(`\n${colors.green}✔ Carrinho esvaziado com sucesso localmente!${colors.reset}`);
    }
  } catch (error) {
    console.log(`\n${colors.red}❌ Erro: ${error.message}${colors.reset}`);
  }
  await question('\nPressione ENTER para voltar ao menu principal...');
}

async function main() {
  // Check backend connection initially
  await checkBackendConnection();

  let active = true;
  while (active) {
    await renderCart();
    
    console.log(`${colors.bold}Menu de Opções:${colors.reset}`);
    console.log(`${colors.cyan}1.${colors.reset} ➕ Adicionar Produto`);
    console.log(`${colors.cyan}2.${colors.reset} ✏️ Modificar Quantidade`);
    console.log(`${colors.cyan}3.${colors.reset} ❌ Remover Produto`);
    console.log(`${colors.cyan}4.${colors.reset} 🧹 Limpar Carrinho`);
    console.log(`${colors.cyan}5.${colors.reset} 🔄 Verificar Conexão API`);
    console.log(`${colors.cyan}6.${colors.reset} 🚪 Sair`);
    
    const choice = await question(`\nEscolha uma opção (1-6): `);
    console.log();

    switch (choice.trim()) {
      case '1':
        await handleAddItem();
        break;
      case '2':
        await handleUpdateQuantity();
        break;
      case '3':
        await handleRemoveItem();
        break;
      case '4':
        await handleClearCart();
        break;
      case '5':
        const connected = await checkBackendConnection();
        if (connected) {
          console.log(`${colors.green}🟢 Conectado à API com sucesso!${colors.reset}`);
        } else {
          console.log(`${colors.yellow}🟡 O backend ainda está offline. Rodando em modo de Simulação Local.${colors.reset}`);
        }
        await question('\nPressione ENTER para continuar...');
        break;
      case '6':
        console.log(`Obrigado por usar o ${colors.cyan}Shoppe Car${colors.reset}! Volte sempre. 👋\n`);
        active = false;
        break;
      default:
        console.log(`${colors.red}Opção inválida! Escolha um número de 1 a 6.${colors.reset}`);
        await question('\nPressione ENTER para tentar novamente...');
    }
  }
  rl.close();
}

main().catch(err => {
  console.error("Erro fatal no CLI:", err);
  rl.close();
});
