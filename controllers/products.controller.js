import productService from '../services/products.service.js';

class ProductController {
  async createProduct(req, res) {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const data = req.body;
    const product = await productService.createProduct(data);
    res.status(201).json({ data: product });
  }

  async getAllProducts(req, res) {
    const products = await productService.getAllProducts();
    res.json({ data: products });
  }

  async getProductById(req, res) {
    if (!req.params || !req.params.productId) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const { productId } = req.params;
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }
    res.json({ data: product });
  }

  async updateProduct(req, res) {
    if (!req.params || !req.body) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const { productId } = req.params;
    const { title, content, password, status } = req.body;
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }
    if (!password) {
      return res.status(401).json({ message: '비밀번호를 입력해주세요.' });
    }
    if (product.password !== password) {
      return res
        .status(401)
        .json({ message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }
    if (title) product.title = title;
    if (content) product.content = content;
    if (status) product.status = status;
    await product.save();
    return res.status(200).json({ message: '상품 정보를 수정하였습니다.' });
  }

  async deleteProduct(req, res) {
    if (!req.body || !req.params) {
      return res
        .status(400)
        .json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const { productId } = req.params;
    const { password } = req.body;
    console.log(productId, password);
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }
    if (product.password !== password) {
      return res
        .status(401)
        .json({ message: '상품을 삭제할 권한이 존재하지 않습니다.' });
    }
    console.log('deleteProduct');
    await productService.deleteProduct(productId);
    return res.status(200).json({ message: '상품을 삭제하였습니다.' });
  }
}

export default new ProductController();
