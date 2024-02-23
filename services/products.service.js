import productRepository from "../repositories/products.repository.js";

class ProductService {
  async createProduct(productData) {
    return await productRepository.create(productData);
  }

  async getAllProducts() {
    return await productRepository.findAll();
  }

  async getProductById(productId) {
    return await productRepository.findById(productId);
  }

  async updateProduct(productId, updateData) {
    return await productRepository.updateById(productId, updateData);
  }

  async deleteProduct(productId) {
    return await productRepository.deleteById(productId);
  }
}

export default new ProductService();
