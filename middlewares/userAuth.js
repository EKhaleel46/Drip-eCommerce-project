const user = require('../models/userModel')

const isLogin = (req, res, next) => {
    try {
        if (req.session.user_id) {
            next()
            
        } else {

            if (req.headers['content-type'] === 'application/json') {
                res.status(401).json({ loginRequired: true });
            } else {
                res.redirect('/login');
            }

        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLoginn = (req, res, next) => {
    try {
        if (req.session.user_id) {
            next()
        } else {
            res.json({ loginRequired: true });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/myAccount')
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message);
    }
}

const userAuthorize = (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.render('users/error-404')
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isBlockAuth = async(req, res, next) =>{ 
    try{
        const userDetail = await user.findOne({_id:req.session.user_id})
        if(userDetail.isBlocked){
            res.redirect('/logout')
        } else {
            next()
        }
    }catch(error){
        console.log(error.message)
    }
}

module.exports = {
    isLogin,
    isLoginn,
    isLogout,
    userAuthorize,
    isBlockAuth
}