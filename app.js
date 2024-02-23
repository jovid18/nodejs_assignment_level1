import express from 'express';
import dotenv from 'dotenv';
import connect from './schemas/index.js';
import productRouter from './routes/products.router.js';
import notFoundErrorHandler from './middlewares/notFoundError.middleware.js';
import generalErrorHandler from './middlewares/generalError.middleware.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get('/', (req, res) => {
  return res.send('Hello World!');
});

app.use('/api', productRouter);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
