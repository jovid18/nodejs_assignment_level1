import express from "express";
import connect from "./schemas/index.js";
import productRouter from "./routes/products.router.js";

const app = express();
const PORT = 3000;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.use("/api", productRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
