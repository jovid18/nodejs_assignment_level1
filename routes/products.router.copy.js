import express from "express";
import Product from "../schemas/products.schema.js";
const router = express.Router();

//1. 상품 등록: /api/products POST
router.post("/products", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const { title, content, author, password } = req.body;
  const product = new Product({ title, content, author, password });
  await product.save();
  res.status(201).json({ message: "판매 상품을 등록하였습니다." });
});

//2. 상품 목록 조회: /api/products GET
router.get("/products", async (req, res) => {
  const products = await Product.find().exec();
  res.json({ data: products });
});

//3. 상품 상세 조회: /api/products/:productId GET
router.get("/products/:productId", async (req, res) => {
  if (!req.params || !req.body) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const { productId } = req.params;
  const product = await Product.findById(productId).exec();
  if (!product) {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  }
  res.json({ data: product });
});

//4. 상품 수정: /api/products/:productId PATCH
router.patch("/products/:productId", async (req, res) => {
  if (!req.body || !req.params) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const { productId } = req.params;
  const { title, content, password, status } = req.body;
  const product = await Product.findById(productId).exec();
  if (!product) {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  }
  if (!password) {
    return res.status(401).json({ message: "비밀번호를 입력해주세요." });
  }
  if (product.password !== password) {
    return res.status(401).json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
  }
  if (title) product.title = title;
  if (content) product.content = content;
  if (status) product.status = status;
  await product.save();
  return res.status(200).json({ message: "상품 정보를 수정하였습니다." });
});

//5. 상품 삭제: /api/products/:productId DELETE
router.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { password } = req.body;
  if (!req.body || !req.params) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const product = await Product.findById(productId).exec();
  if (!product) {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  }
  if (product.password !== password) {
    return res.status(401).json({ message: "상품을 삭제할 권한이 존재하지 않습니다." });
  }
  await Product.findByIdAndDelete(productId).exec();
  return res.status(200).json({ message: "상품을 삭제하였습니다." });
});

export default router;
