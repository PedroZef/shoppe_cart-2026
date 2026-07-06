class Item {
  constructor(name, price, quantity = 1) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('O nome do produto deve ser uma string não vazia.');
    }
    if (typeof price !== 'number' || price <= 0 || isNaN(price)) {
      throw new Error('O preço deve ser um número maior que zero.');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('A quantidade deve ser um número inteiro maior que zero.');
    }

    this.name = name.trim();
    this.price = price;
    this.quantity = quantity;
  }

  getSubtotal() {
    return Number((this.price * this.quantity).toFixed(2));
  }
}

export default Item;
