import Product from "../schemas/products.schema.js";

class ProductRepository {
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async findAll() {
    return await Product.find().exec();
  }

  async findById(productId) {
    return await Product.findById(productId).exec();
  }

  async updateById(productId, updateData) {
    return await Product.findByIdAndUpdate(productId, updateData, { new: true }).exec();
  }

  async deleteById(productId) {
    return await Product.findByIdAndDelete(productId).exec();
  }
}

export default new ProductRepository();
