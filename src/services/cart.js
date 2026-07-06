class Cart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    const existingItem = this.items.find(
      i => i.name.toLowerCase() === item.name.toLowerCase()
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
      // Update price if the newly added item has a different price
      existingItem.price = item.price;
    } else {
      this.items.push(item);
    }
  }

  removeItem(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Nome do produto inválido.');
    }
    const trimmedName = name.trim().toLowerCase();
    const index = this.items.findIndex(i => i.name.toLowerCase() === trimmedName);
    
    if (index === -1) {
      throw new Error(`Produto "${name}" não encontrado no carrinho.`);
    }

    this.items.splice(index, 1);
  }

  updateQuantity(name, quantity) {
    if (!name || typeof name !== 'string') {
      throw new Error('Nome do produto inválido.');
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('A quantidade deve ser um número inteiro não negativo.');
    }

    const trimmedName = name.trim().toLowerCase();
    const item = this.items.find(i => i.name.toLowerCase() === trimmedName);

    if (!item) {
      throw new Error(`Produto "${name}" não encontrado no carrinho.`);
    }

    if (quantity === 0) {
      this.removeItem(name);
    } else {
      item.quantity = quantity;
    }
  }

  clear() {
    this.items = [];
  }

  getTotal() {
    const total = this.items.reduce((acc, item) => acc + item.getSubtotal(), 0);
    return Number(total.toFixed(2));
  }

  getTotalItems() {
    return this.items.reduce((acc, item) => acc + item.quantity, 0);
  }

  listItems() {
    return this.items.map(i => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      subtotal: i.getSubtotal()
    }));
  }
}

export default Cart;
