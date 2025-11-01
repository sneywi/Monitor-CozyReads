// In-memory product storage with pre-populated books
class ProductModel {
  constructor() {
    this.products = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
        price: 12.99,
        category: "Fiction",
        isbn: "978-0743273565",
        stock: 45,
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        publisher: "Scribner",
        publishedDate: "1925-04-10",
        pages: 180,
        language: "English",
        rating: 4.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        description: "A gripping tale of racial injustice and childhood innocence in the American South.",
        price: 14.99,
        category: "Fiction",
        isbn: "978-0061120084",
        stock: 32,
        imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        publisher: "Harper Perennial",
        publishedDate: "1960-07-11",
        pages: 324,
        language: "English",
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        description: "A dystopian masterpiece about totalitarianism and surveillance in a future society.",
        price: 13.99,
        category: "Fiction",
        isbn: "978-0451524935",
        stock: 28,
        imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
        publisher: "Signet Classic",
        publishedDate: "1949-06-08",
        pages: 328,
        language: "English",
        rating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        description: "A brief history of humankind, exploring how Homo sapiens came to dominate the world.",
        price: 18.99,
        category: "Non-Fiction",
        isbn: "978-0062316097",
        stock: 52,
        imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400",
        publisher: "Harper",
        publishedDate: "2015-02-10",
        pages: 443,
        language: "English",
        rating: 4.6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        title: "The Pragmatic Programmer",
        author: "David Thomas, Andrew Hunt",
        description: "Essential reading for software developers seeking to improve their craft.",
        price: 44.99,
        category: "Technology",
        isbn: "978-0135957059",
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
        publisher: "Addison-Wesley",
        publishedDate: "2019-09-13",
        pages: 352,
        language: "English",
        rating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 6,
        title: "Clean Code",
        author: "Robert C. Martin",
        description: "A handbook of agile software craftsmanship with practical advice for writing better code.",
        price: 42.99,
        category: "Technology",
        isbn: "978-0132350884",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
        publisher: "Prentice Hall",
        publishedDate: "2008-08-01",
        pages: 464,
        language: "English",
        rating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 7,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        description: "From the Big Bang to black holes, a journey through space and time.",
        price: 16.99,
        category: "Science",
        isbn: "978-0553380163",
        stock: 38,
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
        publisher: "Bantam",
        publishedDate: "1988-04-01",
        pages: 256,
        language: "English",
        rating: 4.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 8,
        title: "Educated",
        author: "Tara Westover",
        description: "A memoir about a young woman who grows up in a survivalist family and eventually escapes to learn about the wider world through education.",
        price: 15.99,
        category: "Biography",
        isbn: "978-0399590504",
        stock: 41,
        imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
        publisher: "Random House",
        publishedDate: "2018-02-20",
        pages: 334,
        language: "English",
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 9,
        title: "Atomic Habits",
        author: "James Clear",
        description: "An easy and proven way to build good habits and break bad ones.",
        price: 16.99,
        category: "Self-Help",
        isbn: "978-0735211292",
        stock: 67,
        imageUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400",
        publisher: "Avery",
        publishedDate: "2018-10-16",
        pages: 320,
        language: "English",
        rating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 10,
        title: "The Lean Startup",
        author: "Eric Ries",
        description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
        price: 19.99,
        category: "Business",
        isbn: "978-0307887894",
        stock: 29,
        imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400",
        publisher: "Crown Business",
        publishedDate: "2011-09-13",
        pages: 336,
        language: "English",
        rating: 4.6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    this.currentId = 11;
  }

  // Get all products with optional filtering
  findAll(filters = {}) {
    let results = [...this.products];

    // Filter by category
    if (filters.category) {
      results = results.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by price range
    if (filters.minPrice) {
      results = results.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    // Filter by availability
    if (filters.inStock === 'true') {
      results = results.filter(p => p.stock > 0);
    }

    return results;
  }

  // Find product by ID
  findById(id) {
    return this.products.find(p => p.id === parseInt(id));
  }

  // Search products
  search(query) {
    const searchTerm = query.toLowerCase();
    return this.products.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.author.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  }

  // Get products by category
  findByCategory(category) {
    return this.products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Create new product
  create(productData) {
    const product = {
      id: this.currentId++,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.push(product);
    return product;
  }

  // Update product
  update(id, updateData) {
    const index = this.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return this.products[index];
  }

  // Update stock
  updateStock(id, quantity) {
    const product = this.findById(id);
    if (!product) return null;

    product.stock = quantity;
    product.updatedAt = new Date().toISOString();
    return product;
  }

  // Decrease stock (for orders)
  decreaseStock(id, quantity) {
    const product = this.findById(id);
    if (!product) return null;
    if (product.stock < quantity) return null;

    product.stock -= quantity;
    product.updatedAt = new Date().toISOString();
    return product;
  }

  // Delete product
  delete(id) {
    const index = this.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // Get all unique categories
  getCategories() {
    return [...new Set(this.products.map(p => p.category))];
  }
}

// Export singleton instance
module.exports = new ProductModel();
