const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
 

const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const cartRoute = require('./routes/cart');
const payRoute = require('./routes/stripe');
const cors = require('cors');
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('connected');
  })
  .catch((error) => {
    console.log(error); 
  });



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cd(null, 'images')
  },
  filename: (req, file, cd) => {
    cd(null, req.body.name)
  }
})

const upload = multer({storage: storage})

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded')
})

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/checkout', payRoute);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
