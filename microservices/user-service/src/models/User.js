class UserModel {
  constructor() {
    this.users = [];
    this.currentId = 1;
  }

  // Create a new user
  create(userData) {
    const user = {
      id: this.currentId++,
      email: userData.email,
      password: userData.password, // Will be hashed in controller
      name: userData.name,
      address: userData.address || '',
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  // Find user by email
  findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  // Find user by ID
  findById(id) {
    return this.users.find(user => user.id === parseInt(id));
  }

  // Update user
  update(id, updateData) {
    const index = this.users.findIndex(user => user.id === parseInt(id));
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return this.users[index];
  }

  // Get all users (admin function)
  findAll() {
    return this.users;
  }

  // Delete user
  delete(id) {
    const index = this.users.findIndex(user => user.id === parseInt(id));
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}

// Export singleton instance
module.exports = new UserModel();
