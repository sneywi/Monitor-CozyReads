// Cart page (cart.html)

let cartData = null;

// Initialize cart page
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!requireAuth()) return;
    
    await loadCart();
});

// Load cart data
async function loadCart() {
    const userId = getUserId();
    
    if (!userId) {
        showAlert('Please login again', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    try {
        showLoading();
        
        console.log('Loading cart for user:', userId);
        
        const response = await apiCall(`${API_CONFIG.CART_SERVICE}/${userId}`);
        
        console.log('Cart API response:', response);
        
        cartData = response.data || response.cart || response;
        
        console.log('Cart data:', cartData);
        console.log('Cart items:', cartData.items);
        
        displayCart();
        updateCartSummary();
        
        hideLoading();
    } catch (error) {
        hideLoading();
        showAlert('Failed to load cart', 'error');
        console.error('Error loading cart:', error);
    }
}

// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) {
        console.error('Cart items container not found');
        return;
    }
    
    // Empty cart
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some books to get started!</p>
                <a href="index.html" class="btn btn-primary mt-2">Browse Books</a>
            </div>
        `;
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = cartData.items.map(item => {
        console.log('Displaying item:', item);
        
        return `
            <div class="cart-item" data-product-id="${item.productId || item.id}">
                <img src="${item.imageUrl || 'images/book-placeholder.jpg'}" 
                     alt="${item.title}" 
                     class="cart-item-image"
                     onerror="this.src='images/book-placeholder.jpg'">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="book-author">by ${item.author}</p>
                    <p class="cart-item-price">${formatCurrency(item.price)}</p>
                    
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.productId || item.id}', ${item.quantity - 1})">
                            −
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.productId || item.id}', ${item.quantity + 1})">
                            +
                        </button>
                    </div>
                    
                    <a class="remove-btn" onclick="removeFromCart('${item.productId || item.id}')">
                        Remove
                    </a>
                </div>
                <div class="cart-item-total">
                    <strong>${formatCurrency(item.price * item.quantity)}</strong>
                </div>
            </div>
        `;
    }).join('');
}

// Update cart summary
function updateCartSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        if (subtotalEl) subtotalEl.textContent = formatCurrency(0);
        if (taxEl) taxEl.textContent = formatCurrency(0);
        if (totalEl) totalEl.textContent = formatCurrency(0);
        return;
    }
    
    const subtotal = cartData.totalPrice || 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    console.log('Cart summary:', {subtotal, tax, total});
    
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (taxEl) taxEl.textContent = formatCurrency(tax);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

// Update item quantity
async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        await removeFromCart(productId);
        return;
    }
    
    const userId = getUserId();
    
    if (!userId) {
        showAlert('Please login again', 'warning');
        return;
    }
    
    try {
        showLoading();
        
        console.log('Updating quantity:', {userId, productId, newQuantity});
        
        await apiCall(`${API_CONFIG.CART_SERVICE}/update`, {
            method: 'PUT',
            body: JSON.stringify({
                userId,
                productId,
                quantity: newQuantity
            })
        });
        
        await loadCart();
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showAlert(error.message || 'Failed to update quantity', 'error');
        console.error('Error updating quantity:', error);
    }
}

// Remove item from cart
async function removeFromCart(productId) {
    const userId = getUserId();
    
    if (!userId) {
        showAlert('Please login again', 'warning');
        return;
    }
    
    if (!confirm('Remove this item from cart?')) return;
    
    try {
        showLoading();
        
        console.log('Removing from cart:', {userId, productId});
        
        await apiCall(`${API_CONFIG.CART_SERVICE}/remove/${userId}/${productId}`, {
            method: 'DELETE'
        });
        
        await loadCart();
        showAlert('Item removed from cart', 'success');
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showAlert(error.message || 'Failed to remove item', 'error');
        console.error('Error removing item:', error);
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        showAlert('Your cart is empty', 'warning');
        return;
    }
    
    window.location.href = 'checkout.html';
}
