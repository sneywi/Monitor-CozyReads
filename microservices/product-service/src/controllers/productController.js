const ProductModel = require('../models/Product');

// Get all products with optional filters
exports.getAllProducts = (req, res) => {
  try {
    const { category, minPrice, maxPrice, inStock } = req.query;
    
    const filters = {
      category,
      minPrice,
      maxPrice,
      inStock
    };

    const products = ProductModel.findAll(filters);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get single product by ID
exports.getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Search products
exports.searchProducts = (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query (q) is required'
      });
    }

    const products = ProductModel.search(q);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = (req, res) => {
  try {
    const { category } = req.params;
    const products = ProductModel.findByCategory(category);

    res.status(200).json({
      success: true,
      count: products.length,
      category: category,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
};

// Get all categories
exports.getCategories = (req, res) => {
  try {
    const categories = ProductModel.getCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Create new product (admin)
exports.createProduct = (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      category,
      isbn,
      stock,
      imageUrl,
      publisher,
      publishedDate,
      pages,
      language
    } = req.body;

    // Validation
    if (!title || !author || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, author, price, and category are required'
      });
    }

    const product = ProductModel.create({
      title,
      author,
      description,
      price: parseFloat(price),
      category,
      isbn,
      stock: stock || 0,
      imageUrl,
      publisher,
      publishedDate,
      pages,
      language,
      rating: 0
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product (admin)
exports.updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = ProductModel.update(id, updateData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Update product stock
exports.updateStock = (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required'
      });
    }

    const product = ProductModel.updateStock(id, stock);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};

// Delete product (admin)
exports.deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = ProductModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Health check
exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    service: 'product-service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
};
