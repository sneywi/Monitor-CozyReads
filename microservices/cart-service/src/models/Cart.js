// In-memory cart storage
// Structure: { userId: { items: [], totalPrice: 0, totalItems: 0 } }

class CartModel {
  constructor() {
    this.carts = {};
  }

  // Get cart for a user
  getCart(userId) {
    if (!this.carts[userId]) {
      this.carts[userId] = {
        userId: userId,
        items: [],
        totalPrice: 0,
        totalItems: 0,
        updatedAt: new Date().toISOString()
      };
    }
    return this.carts[userId];
  }

  // Add item to cart
  addItem(userId, product, quantity = 1) {
    const cart = this.getCart(userId);
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === product.id
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal = 
        cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
    } else {
      // Add new item
      cart.items.push({
        productId: product.id,
        title: product.title,
        author: product.author,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
        subtotal: product.price * quantity
      });
    }

    this.calculateTotal(userId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  // Update item quantity
  updateItem(userId, productId, quantity) {
    const cart = this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      item => item.productId === parseInt(productId)
    );

    if (itemIndex === -1) return null;

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = 
        cart.items[itemIndex].price * quantity;
    }

    this.calculateTotal(userId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  // Remove item from cart
  removeItem(userId, productId) {
    const cart = this.getCart(userId);
    const itemIndex = cart.items.findIndex(
      item => item.productId === parseInt(productId)
    );

    if (itemIndex === -1) return null;

    cart.items.splice(itemIndex, 1);
    this.calculateTotal(userId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  // Clear entire cart
  clearCart(userId) {
    this.carts[userId] = {
      userId: userId,
      items: [],
      totalPrice: 0,
      totalItems: 0,
      updatedAt: new Date().toISOString()
    };
    return this.carts[userId];
  }

  // Calculate cart totals
  calculateTotal(userId) {
    const cart = this.carts[userId];
    if (!cart) return;

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.subtotal, 
      0
    );
    cart.totalItems = cart.items.reduce(
      (total, item) => total + item.quantity, 
      0
    );

    // Round to 2 decimal places
    cart.totalPrice = Math.round(cart.totalPrice * 100) / 100;
  }

  // Get all carts (for testing/admin)
  getAllCarts() {
    return this.carts;
  }

  // Check if cart exists
  cartExists(userId) {
    return this.carts.hasOwnProperty(userId);
  }
}

// Export singleton instance
module.exports = new CartModel();
