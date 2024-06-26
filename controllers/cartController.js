const product = require('../models/productModel')
const cart = require('../models/cartModel')
const user = require('../models/userModel')
const address = require('../models/addressModel')
const coupon = require('../models/couponModel')
const wallet = require('../models/walletModel')

const loadCart = async(req,res)=>{
    try{
        // loading cart quantity
        const userId = req.session.user_id
        let cartItems = await cart.findOne({userId : userId}).populate('products.productId')
        
        res.render('users/cart',{cartItems})
    }catch(error){
        console.log(error.message);
    }
}

const addToCart = async(req,res)=>{
    try{
        const productId = req.body.productId
        const userId = req.session.user_id
        const quantity = req.body.quantity || 1

        const exist = await cart.findOne({ userId : userId, products: { $elemMatch : { productId : productId } } })
        if(!exist){
            

            await cart.findOneAndUpdate(
                { userId : userId},

                {
                    $addToSet : {

                        products :{

                            productId : productId,
                            quantity : quantity

                        }

                    }
                },

                { new : true, upsert : true }
            );

            res.send({ success : true })
            console.log(':::: Product Added successfully ::::');
        } else {
            res.send({ exist : true })
            console.log(':::: Product Already Added ::::');
        }

    }catch(error){
        console.log(error.message);
    }
}

const updateCart = async(req,res)=>{
    try{
        const productId = req.body.prodId
        const updatedQuantity = req.body.updtdQuantity
        const cartID = req.body.cartId

        const updatedCart = await cart.findOneAndUpdate({_id : cartID, 'products.productId' : productId}, {
            $set : {"products.$.quantity" : updatedQuantity} },{new:true}
        )
        
        res.json({success:true})

    }catch(error){
        console.log(error.message);
    }
}

const removeFromCart = async(req,res) =>{
    try{
        const cartId = req.query.id
        const userId = req.session.user_id

        const removed = await cart.updateOne({userId : userId},{$pull: {products : { productId : cartId }}})

        if(removed){
            res.json({removed:true})
        }

    }catch(error){
        console.log(error.message);
    }
}

const clearCart = async(req, res) => {
    try{
        const userId = req.session.user_id
        await cart.findOneAndDelete({userId:userId})
        res.json({success:true})
    }catch(error){
        console.log(error.message);
    }
} 

const loadCheckout = async(req,res) => {
    try{
        // loading cart quantity
        const userId = req.session.user_id
        const cartItems = await cart.findOne({userId : userId}).populate('products.productId')
        const addresses = await address.find({userId:userId}).sort({_id:-1}).limit(3)
        const coupons = await coupon.find({})
        const wallett = await wallet.findOne({userId:userId})
        
        let couponPercentage = 0
        let appliedCoupon;

        console.log("session : "+req.session.coupon);

        if(req.session.coupon){
            appliedCoupon = await coupon.findOne({_id:req.session.coupon})
            couponPercentage = appliedCoupon.percentage
        }

        res.render('users/checkout',{cartItems,addresses,coupons,couponPercentage,appliedCoupon,wallett})
    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    loadCheckout
}
