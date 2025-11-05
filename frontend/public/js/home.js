// Home page (index.html)

let allProducts = [];
let currentCategory = 'All';

// Initialize home page
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    setupSearchBar();
    setupCategoryFilters();
    updateCartBadge();
});

// Load all products
async function loadProducts() {
    try {
        console.log('Loading products...');
        showLoading();
        
        const response = await apiCall('${API_CONFIG.PRODUCT_SERVICE}');
        console.log('Products API response:', response);
        
        // Handle different response formats
        allProducts = response.data || response.products || response;
        console.log('Products extracted:', allProducts);
        
        // Verify it's an array
        if (!Array.isArray(allProducts)) {
            console.error('Expected array but got:', allProducts);
            hideLoading();
            showAlert('Failed to load products - invalid format', 'error');
            return;
        }
        
        console.log('Loaded ${allProducts.length} products');
        
        displayProducts(allProducts);
        
        hideLoading();
        console.log('Products displayed successfully');
        
    } catch (error) {
        console.error('Error loading products:', error);
        hideLoading();
        showAlert('Failed to load products. Please try again.', 'error');
    }
} 

// Display products in grid
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    
    if (!productGrid) return;
    
    if (products.length === 0) {
        productGrid.innerHTML = '
            <div class="empty-state">
                <p>No products found.</p>
            </div>
        ';
        return;
    }
    
    productGrid.innerHTML = products.map(product => '
        <div class="book-card">
            <img src="${product.imageUrl || 'images/book-placeholder.jpg'}" 
                 alt="${product.title}" 
                 class="book-image"
                 onerror="this.src='images/book-placeholder.jpg'">
            <div class="book-info">
                <span class="book-category">${product.category}</span>
                <h3 class="book-title">${product.title}</h3>
                <p class="book-author">by ${product.author}</p>
                <div class="book-footer">
                    <div>
                        <div class="book-price">${formatCurrency(product.price)}</div>
                        <div class="book-stock ${getStockClass(product.stock)}">
                            ${getStockText(product.stock)}
                        </div>
                    </div>
                </div>
                <button 
                    class="btn btn-primary btn-block mt-1" 
                    onclick="addToCart('${product.id}')"
                    ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    ').join('');
}

// Get stock CSS class
function getStockClass(stock) {
    if (stock === 0) return 'out';
    if (stock < 5) return 'low';
    return '';
}

// Get stock display text
function getStockText(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock < 5) return 'Only ${stock} left!';
    return '${stock} in stock';
}

// Setup search functionality
function setupSearchBar() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (!searchInput) return;
    
    // Search on button click
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        displayProducts(filterByCategory(allProducts));
        return;
    }
    
    const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.author.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    displayProducts(filterByCategory(filtered));
}

// Setup category filters
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            currentCategory = button.dataset.category;
            const filtered = filterByCategory(allProducts);
            displayProducts(filtered);
        });
    });
}

// Filter products by category
function filterByCategory(category) {
    // Update active button
    document.querySelectorAll('.category-filters .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter products
    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(product => product.category === category);
        displayProducts(filtered);
    }
}

// Show loading state
function showLoading() {
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
        console.log('Loading shown');
    }
}

// Hide loading state
function hideLoading() {
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
        console.log('Loading hidden');
    }
}

// Add product to cart
async function addToCart(productId) {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showAlert('Please login to add items to cart', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
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
        
        console.log('Adding to cart:', {userId, productId});
        
        await apiCall('${API_CONFIG.CART_SERVICE}/add', {
            method: 'POST',
            body: JSON.stringify({
                userId,
                productId,
                quantity: 1
            })
        });
        
        hideLoading();
        showAlert('Product added to cart!', 'success');
        
        await updateCartBadge();
        
    } catch (error) {
        hideLoading();
        showAlert(error.message || 'Failed to add to cart', 'error');
        console.error('Error adding to cart:', error);
    }
}

// Update cart badge count
async function updateCartBadge() {
    if (!isLoggedIn()) {
        updateCartCount(0);
        return;
    }

    const userId = getUserId();

    if (!userId) {
        console.warn('No user ID found');
        updateCartCount(0);
        return;
    }

    try {
        const response = await apiCall('${API_CONFIG.CART_SERVICE}/${userId}');

        console.log('Cart response:', response);

        const cart = response.cart || response.data || response;
        const items = cart.items || [];
        const itemCount = items.length;

        console.log('Cart items count:', itemCount);

        updateCartCount(itemCount);
    } catch (error) {
        console.error('Error updating cart badge:', error);
        updateCartCount(0);
    }
}
