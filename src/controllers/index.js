import Item from '../services/item.js';
import Cart from '../services/cart.js';

const cart = new Cart();

// Exemplo de uso interno
try {
  cart.addItem(new Item("Camisa", 50, 2));
  cart.addItem(new Item("Tênis", 200, 1));

  console.log("Itens no carrinho (Exemplo):", cart.listItems());
  console.log("Total (Exemplo):", cart.getTotal());
} catch (error) {
  console.error("Erro no exemplo:", error.message);
}

export default cart;
