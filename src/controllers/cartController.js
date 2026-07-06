import Cart from '../services/cart.js';
import Item from '../services/item.js';

// Singleton in-memory cart instance
const cart = new Cart();

export const getCart = (req, res) => {
  res.json({
    items: cart.listItems(),
    totalItems: cart.getTotalItems(),
    totalPrice: cart.getTotal()
  });
};

export const addItem = (req, res, next) => {
  try {
    const { name, price, quantity } = req.body;
    const item = new Item(name, price, quantity);
    
    cart.addItem(item);

    res.status(201).json({
      message: `Produto "${item.name}" adicionado com sucesso!`,
      cart: {
        items: cart.listItems(),
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotal()
      }
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

export const updateQuantity = (req, res, next) => {
  try {
    const { name } = req.params;
    const { quantity } = req.body;

    cart.updateQuantity(name, quantity);

    res.json({
      message: `Quantidade do produto "${name}" atualizada para ${quantity}.`,
      cart: {
        items: cart.listItems(),
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotal()
      }
    });
  } catch (error) {
    error.status = 404; // Product not found in cart
    next(error);
  }
};

export const removeItem = (req, res, next) => {
  try {
    const { name } = req.params;

    cart.removeItem(name);

    res.json({
      message: `Produto "${name}" removido com sucesso.`,
      cart: {
        items: cart.listItems(),
        totalItems: cart.getTotalItems(),
        totalPrice: cart.getTotal()
      }
    });
  } catch (error) {
    error.status = 404;
    next(error);
  }
};

export const clearCart = (req, res) => {
  cart.clear();
  res.json({
    message: 'Carrinho esvaziado com sucesso.',
    cart: {
      items: [],
      totalItems: 0,
      totalPrice: 0
    }
  });
};
