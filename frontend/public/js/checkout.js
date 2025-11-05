// Checkout page (checkout.html)

let cartData = null;
let selectedPaymentMethod = 'card';

// Initialize checkout page
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!requireAuth()) return;
    
    await loadCheckoutData();
    setupPaymentMethods();
    setupCheckoutForm();
});

// Load cart data for checkout
async function loadCheckoutData() {
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
        
        console.log('Loading checkout data for user:', userId);
        
        const response = await apiCall(`${API_CONFIG.CART_SERVICE}/${userId}`);
        
        console.log('Checkout cart response:', response);
        
        cartData = response.data || response.cart || response;
        
        console.log('Cart data for checkout:', cartData);
        
        // Check if cart is empty
        if (!cartData || !cartData.items || cartData.items.length === 0) {
            showAlert('Your cart is empty', 'warning');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        displayOrderSummary();
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showAlert('Failed to load checkout data', 'error');
        console.error('Error loading checkout:', error);
    }
}

// Display order summary
function displayOrderSummary() {
    const orderItemsEl = document.getElementById('order-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');
    
    if (!cartData || !orderItemsEl) {
        console.error('Missing cart data or order items element');
        return;
    }
    
    console.log('Displaying order summary:', cartData);
    
    // Display items
    orderItemsEl.innerHTML = cartData.items.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${item.title} (x${item.quantity})</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cartData.totalPrice || 0;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    console.log('Order totals:', {subtotal, tax, total});
    
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (taxEl) taxEl.textContent = formatCurrency(tax);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

// Setup payment method selection
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Update active state
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            
            // Update selected payment method
            selectedPaymentMethod = method.dataset.method;
            
            console.log('Payment method selected:', selectedPaymentMethod);
            
            // Show/hide card details
            toggleCardDetails();
        });
    });
}

// Toggle card details visibility
function toggleCardDetails() {
    const cardDetails = document.getElementById('card-details');
    if (cardDetails) {
        cardDetails.style.display = selectedPaymentMethod === 'card' ? 'block' : 'none';
    }
}

// Setup checkout form submission
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

// Handle checkout submission
async function handleCheckout(e) {
    e.preventDefault();
    
    const userId = getUserId();
    
    if (!userId) {
        showAlert('Please login again', 'warning');
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const shippingAddress = {
        fullName: formData.get('fullName'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        phone: formData.get('phone')
    };
    
    // Validate form
    if (!validateCheckoutForm(shippingAddress)) {
        return;
    }
    
    try {
        showLoading();
        
        console.log('Creating order for user:', userId);
        console.log('Shipping address:', shippingAddress);
        
        // Step 1: Create order
        const orderResponse = await apiCall(`${API_CONFIG.ORDER_SERVICE}/create`, {
            method: 'POST',
            body: JSON.stringify({
                userId,
                shippingAddress
            })
        });
        
        console.log('Order response:', orderResponse);
        
        const order = orderResponse.order || orderResponse.data?.order || orderResponse.data;
        
        if (!order) {
            throw new Error('Order creation failed - no order returned');
        }
        
        console.log('Order created:', order);
        
        const orderId = order.orderId || order._id || order.id;
        
        if (!orderId) {
            throw new Error('Order ID not found in response');
        }
        
        console.log('Order ID:', orderId);
        
        // Step 2: Process payment
        const paymentData = {
            orderId,
            userId,
            amount: order.totalAmount,
            paymentMethod: selectedPaymentMethod
        };
        
        // Add card details if card payment
        if (selectedPaymentMethod === 'card') {
            paymentData.cardDetails = {
                cardNumber: formData.get('cardNumber'),
                cardHolder: formData.get('cardHolder'),
                expiryDate: formData.get('expiryDate'),
                cvv: formData.get('cvv')
            };
        }
        
        console.log('Processing payment:', {orderId, amount: order.totalAmount, method: selectedPaymentMethod});
        
        const paymentResponse = await apiCall(`${API_CONFIG.PAYMENT_SERVICE}/process`, {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
        
        console.log('Payment response:', paymentResponse);
        
        hideLoading();
        
        // Show success message
        showOrderSuccess(order);
        
    } catch (error) {
        hideLoading();
        showAlert(error.message || 'Failed to place order', 'error');
        console.error('Error during checkout:', error);
    }
}

// Validate checkout form
function validateCheckoutForm(address) {
    // Check required fields
    if (!address.fullName || !address.address || !address.city || 
        !address.state || !address.zipCode || !address.phone) {
        showAlert('Please fill in all required fields', 'warning');
        return false;
    }
    
    // Validate card details if card payment
    if (selectedPaymentMethod === 'card') {
        const cardNumber = document.querySelector('[name="cardNumber"]').value;
        const cardHolder = document.querySelector('[name="cardHolder"]').value;
        const expiryDate = document.querySelector('[name="expiryDate"]').value;
        const cvv = document.querySelector('[name="cvv"]').value;
        
        if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
            showAlert('Please fill in all card details', 'warning');
            return false;
        }
        
        // Basic card number validation (16 digits)
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            showAlert('Please enter a valid 16-digit card number', 'warning');
            return false;
        }
    }
    
    return true;
}

// Show order success message
function showOrderSuccess(order) {
    const checkoutContainer = document.querySelector('.checkout-container');
    
    if (checkoutContainer) {
        checkoutContainer.innerHTML = `
            <div class="order-success" style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; color: var(--success); margin-bottom: 1rem;">✓</div>
                <h1 style="color: var(--success); margin-bottom: 1rem;">Order Placed Successfully!</h1>
                <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 2rem;">
                    Your order has been placed and payment processed.
                </p>
                <div style="background: white; padding: 2rem; border-radius: 12px; margin: 2rem auto; max-width: 500px;">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> ${order.orderId || order._id || order.id}</p>
                    <p><strong>Total Amount:</strong> ${formatCurrency(order.totalAmount)}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
                </div>
                <a href="index.html" class="btn btn-primary btn-lg">Continue Shopping</a>
            </div>
        `;
    }
    
    // Clear cart count
    updateCartCount(0);
}
