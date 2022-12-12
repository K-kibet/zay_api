const router = require('express').Router();
const Product = require('../models/Product');
const {verifyTokenAndAdmin} = require('./verifyToken');

//CREATE A PRODUCT
router.post('/', async (req, res) => {
    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);

    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE A Product
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{ 
        const updatedProduct = Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//DELETE A Product
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET A PRODUCT
router.get('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
})



//Get ALL PRODUCTS
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let prdocts;

        if(qNew) {
            prdocts= await new Product.find().sort({createdAt: -1}).limit(5);
        } else if(qCategory) {
            prdocts = await new Product.find({categories: {
                $in: [qCategory]
            }})
        } else {
            prdocts = await Product.find();
        }

        res.status(200).json(prdocts);

    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;