const product = require('../models/productModel')
const category = require('../models/categoryModel')


const loadProducts = async (req, res) => {
    try {
        const products = await product.find().populate('category')
        const categories = await category.find()
        res.render('admin/products', { products, categories })
    } catch (error) {
        console.log(error.message);
    }
}

const loadAddProduct = async(req,res) => {
    try{
        const products = await product.find()
        const categories = await category.find()
        res.render('admin/addProducts',{categories,products})
    }catch(error){
        console.log(error.message);
    }
}

const addProduct = async (req, res) => {
    try {
        const {name, price, quantity, description, category} = req.body

        const newProduct = new product({
            name: name,
            price: price,
            quantity: quantity,
            images: req.files.map(file => file.filename),
            description: description,
            category: category,
            createdAt : Date.now()
        })
        const prodsaved = await newProduct.save()

        if (prodsaved) {
            res.redirect('/admin/products')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadEditProduct = async (req,res) =>{
    try{
        const { id } = req.query
        const productData = await product.findById({_id:id}).populate('category')
        const categories = await category.find()

        console.log(productData);

        res.render('admin/editproducts',{productData,categories})
    }catch(error){
        console.log(error.message);
    }
}

const editProduct = async(req, res)=>{
    try{
        const { name, description, price, quantity,category, id } = req.body;
        const newImages = req.files.map(file => file.filename);

        const existingData = await product.findOne({_id: id});
        
        let imageArr = existingData.images.slice(); // Start with a copy of the existing images

        // Assuming you've corrected the form to pass old image names correctly
        const oldImageNames = [req.body.oldImage1, req.body.oldImage2, req.body.oldImage3, req.body.oldImage4];

        newImages.forEach((newImage, index) => {
            const oldImageName = oldImageNames[index];
            const oldImageIndex = imageArr.indexOf(oldImageName);
            if (oldImageIndex !== -1) {
                // Replace the old image with the new one
                imageArr[oldImageIndex] = newImage;
            } else {
                // If the old image is not found, add the new image to the array
                imageArr.push(newImage);
            }
        });
        
        const updatedProduct = await product.findOneAndUpdate({_id:req.body.id},{$set:{name,description,price,quantity,category,images:imageArr}},{new:true})
        console.log(updatedProduct);

        if(updatedProduct)
        res.redirect('/admin/products')

    }catch(error){
        console.log(error.message);
        // res.status(500).json({message : 'An error occurred while updating the product'});
    }
}

const unlistingProduct = async(req, res)=>{
    try{
        const { productId } = req.body;
        const productData = await product.findOne({ _id : productId})

        if(!productData.isBlocked){
            await product.findByIdAndUpdate({ _id : productId}, {$set: {isBlocked : true}})
            console.log('Product Unlisted');
        } else {
            await product.findByIdAndUpdate({ _id : productId}, {$set: {isBlocked : false}})
            console.log('Product listed');
        }

        res.json({res:true})

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadProducts,
    loadAddProduct,
    addProduct,
    loadEditProduct,
    editProduct,
    unlistingProduct
}