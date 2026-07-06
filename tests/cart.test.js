import { test, describe } from 'node:test';
import assert from 'node:assert';
import Item from '../src/services/item.js';
import Cart from '../src/services/cart.js';

describe('Item Class', () => {
  test('should create an item with valid fields', () => {
    const item = new Item('Camisa', 49.9, 2);
    assert.strictEqual(item.name, 'Camisa');
    assert.strictEqual(item.price, 49.9);
    assert.strictEqual(item.quantity, 2);
    assert.strictEqual(item.getSubtotal(), 99.8);
  });

  test('should throw error for invalid values', () => {
    assert.throws(() => new Item('', 10), /nome do produto/);
    assert.throws(() => new Item('Camisa', -5), /preço/);
    assert.throws(() => new Item('Camisa', 10, -2), /quantidade/);
    assert.throws(() => new Item('Camisa', 10, 1.5), /quantidade/);
  });
});

describe('Cart Class', () => {
  test('should add items and calculate totals', () => {
    const cart = new Cart();
    cart.addItem(new Item('Camisa', 50, 2));
    cart.addItem(new Item('Tênis', 200, 1));

    assert.strictEqual(cart.getTotalItems(), 3);
    assert.strictEqual(cart.getTotal(), 300);
    assert.strictEqual(cart.listItems().length, 2);
  });

  test('should increment quantity when adding duplicate items', () => {
    const cart = new Cart();
    cart.addItem(new Item('Camisa', 50, 2));
    cart.addItem(new Item('Camisa', 50, 3));

    assert.strictEqual(cart.getTotalItems(), 5);
    assert.strictEqual(cart.getTotal(), 250);
    assert.strictEqual(cart.listItems().length, 1);
  });

  test('should remove items correctly', () => {
    const cart = new Cart();
    cart.addItem(new Item('Camisa', 50, 2));
    cart.removeItem('Camisa');

    assert.strictEqual(cart.getTotalItems(), 0);
    assert.strictEqual(cart.getTotal(), 0);
  });

  test('should update item quantities', () => {
    const cart = new Cart();
    cart.addItem(new Item('Camisa', 50, 2));
    cart.updateQuantity('Camisa', 5);

    assert.strictEqual(cart.getTotalItems(), 5);
    assert.strictEqual(cart.getTotal(), 250);

    cart.updateQuantity('Camisa', 0);
    assert.strictEqual(cart.getTotalItems(), 0);
  });
});
