const coupon = require('../models/couponModel')
const dayjs = require('dayjs')

//---------  ADMIN SIDE  ---------//

const loadCoupons = async(req,res) =>{
    try{
        const coupons = await coupon.find()

        res.render('admin/coupons',{coupons})
    }catch(error){
        console.log(error.message);
    }
}

function generateRandomString() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let randomString = '';
  
    for (let i = 0; i < 5; i++) {
      randomString += letters.charAt(Math.floor(Math.random() * letters.length));
    }
  
    for (let i = 0; i < 3; i++) {
      randomString += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
  
    // Shuffle the string to ensure random order
    randomString = randomString.split('').sort(() => Math.random() - 0.5).join('');
  
    return randomString;
}
  

const addCoupon = async(req,res) =>{
    try{
        const {couponname,couponDescription,percentage} = req.body

        const couponCode = generateRandomString()
        console.log(couponCode);

        const expirationDate = dayjs().add(7, 'day')

        const addedCoupon = await coupon.create({
            couponName : couponname,
            couponCode : couponCode,
            couponDescription : couponDescription,
            percentage : percentage,
            startDate : Date.now(),
            endDate : expirationDate.toDate()
        })

        console.log(addedCoupon);
        
        if(addedCoupon){
            res.redirect('/admin/coupons')
        }
    }catch(error){
        console.log(error.message);
    }
}

const editCoupon = async(req,res) =>{
    try{
        const {couponId} = req.body
        const findingCoupon = await coupon.findOne({_id : couponId})
        res.json({couponName : findingCoupon.couponName, couponCode : findingCoupon.couponCode, couponDescription : findingCoupon.couponDescription, percentage : findingCoupon.percentage})
    }catch(error){
        console.log(error.message);
    }
}

const saveEditCoupon = async(req, res) =>{
    try{
        const {couponId,couponCode,couponName,couponPercentage,couponDescription} = req.body

        const saved = await coupon.findOneAndUpdate({_id:couponId},{$set:{couponName : couponName, couponCode : couponCode, percentage : couponPercentage, couponDescription : couponDescription}})

        res.json({success : true})
    }catch(error){
        console.log(error.message);
    }
}

const couponDelete = async(req, res) =>{
    try{
        const {couponId} = req.body
        const done = await coupon.findOneAndDelete({_id:couponId})

        if(done){
            res.json({success:true})
        }
    }catch(error){
        console.log();
    }
}

//---------  USER SIDE  ---------//

const validateCoupon = async(req, res) =>{
    try{
        const {couponCode} = req.body
        const foundCoupon = await coupon.findOne({couponCode:couponCode})
        // console.log(foundCoupon);

        if(foundCoupon){
            res.json({success:true})
        } else {
            res.json({notFound:true})
        }
    }catch(error){
        console.log(error.message);
    }
}

const applyCoupon = async(req, res) =>{
    try{
        const {grandTotal,couponCode} = req.body

        if(req.session.coupon){
            res.json({exist:true})

        } else {
            const foundCoupon = await coupon.findOne({couponCode:couponCode})
            const discountPrice = (grandTotal * foundCoupon.percentage / 100)
            const grandTotaltot = grandTotal - discountPrice

            req.session.coupon=foundCoupon._id

            res.json({success:true,discountPrice,grandTotaltot})
        }

    }catch(error){
        console.log(error.message);
    }
}

const removeCoupon = async(req,res) =>{
    try{
        delete req.session.coupon

        res.json({success:true})

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadCoupons,
    addCoupon,
    editCoupon,
    saveEditCoupon,
    couponDelete,
    validateCoupon,
    applyCoupon,
    removeCoupon
}