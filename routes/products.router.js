import express from "express";
import Product from "../schemas/products.schema.js";
const router = express.Router();

//API 정리
//이미 app.js에서 /api로 라우팅을 했기 때문에, /api는 생략
//1. 상품 등록: /api/products POST
// request:
// {
//   "title":"아이폰15 MAX",
//   "content": "얼마 사용하지 않은 제품 팝니다.",
//   "author":"판매자",
//   "password":"1234"
// }
//response:
// {
//     "message": "판매 상품을 등록하였습니다."
//   }
//response(error)
//# 400 body 또는 params를 입력받지 못한 경우
// { errorMessage: '데이터 형식이 올바르지 않습니다.' }
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
//request:
//{}
//response:
// {
//     "data": [
//       {
//         "_id": "652b6606234d72a8d2555e29",
//         "title": "아이폰15 MAX",
//         "author": "판매자",
//         "status": "FOR_SALE",
//         "createdAt": "2023-10-15T04:09:42.059Z"
//       },
//       {
//         "_id": "652b619597690183899d2f74",
//         "title": "아이폰15 MAX 수정됨",
//         "author": "판매자",
//         "status": "SOLD_OUT",
//         "createdAt": "2023-10-15T03:50:45.866Z"
//       }
//     ]
//   }
router.get("/products", async (req, res) => {
  const products = await Product.find().exec();
  res.json({ data: products });
});

//3. 상품 상세 조회: /api/products/:productId GET
//request:
//{}
//response:
// {
//     "data": {
//       "_id": "652b619597690183899d2f74",
//       "title": "아이폰15 MAX",
//       "content": "얼마 사용하지 않은 제품 팝니다.",
//       "author": "판매자",
//       "status": "FOR_SALE",
//       "createdAt": "2023-10-15T03:50:45.866Z"
//     }
//   }
//response(error)
// # 400 body 또는 params를 입력받지 못한 경우
// { message: '데이터 형식이 올바르지 않습니다.' }
// # 404 productId에 해당하는 상품이 존재하지 않을 경우
// { message: 상품 조회에 실패하였습니다. }
router.get("/products/:productId", async (req, res) => {
  if (!req.params || !req.body) {
    return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  const { productId } = req.params;
  const product = await Product.findById(productId).exec();
  if (!product) {
    return res.status(404).json({ message: "상품 조회에 실패하였습니다." });
  } else {
    res.json({ data: product });
  }
});

//4. 상품 수정: /api/products/:productId PATCH
// request:
// {
//     "title":"아이폰15 MAX 수정됨",
//     "content": "얼마 사용하지 않은 제품 팝니다.",
//     "password":"1234",
//     "status":"SOLD_OUT"
//   }
// response:
// {
//     "message": "상품 정보를 수정하였습니다."
//   }
// 수정할 상품과 비밀번호 일치 여부를 확인한 후, 동일할 때만 글이 수정되게 하기
// 비밀번호가 일치하지 않을 경우, 다시 입력하도록 하기
// 선택한 상품이 존재하지 않을 경우, “상품 조회에 실패하였습니다." 메시지 반환하기
//response(error)
//# 400 body 또는 params를 입력받지 못한 경우
// { message: '데이터 형식이 올바르지 않습니다.' }
// # 404 productId에 해당하는 상품이 존재하지 않을 경우
// { message: 상품 조회에 실패하였습니다. }
// # 401 상품의 비밀번호가 일치하지 않을 경우
// { message: 상품을 수정할 권한이 존재하지 않습니다. }
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
  if (product.password === password) {
    if (title) product.title = title;
    if (content) product.content = content;
    if (status) product.status = status;
    await product.save();
    return res.status(200).json({ message: "상품 정보를 수정하였습니다." });
  } else {
    return res.status(401).json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
  }
});
//5. 상품 삭제: /api/products/:productId DELETE
// request:
//{
//     "password": "1234"
// }
// response:
// {
//     "message": "상품을 삭제하였습니다."
//   }
// 수정할 상품과 비밀번호 일치 여부를 확인한 후, 동일할 때만 글이 삭제되게 하기
// 비밀번호가 일치하지 않을 경우, 다시 입력하도록 하기

// 선택한 상품이 존재하지 않을 경우, “상품 조회에 실패하였습니다." 메시지 반환하기
//response(error)
//# 400 body 또는 params를 입력받지 못한 경우
// { message: '데이터 형식이 올바르지 않습니다.' }
// # 404 productId에 해당하는 상품이 존재하지 않을 경우
// { message: 상품 조회에 실패하였습니다. }
// # 401 상품의 비밀번호가 일치하지 않을 경우
// { message: 상품을 삭제할 권한이 존재하지 않습니다. }
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
  if (product.password === password) {
    await Product.findByIdAndDelete(productId).exec();
    return res.status(200).json({ message: "상품을 삭제하였습니다." });
  } else {
    return res.status(401).json({ message: "상품을 삭제할 권한이 존재하지 않습니다." });
  }
});

export default router;
