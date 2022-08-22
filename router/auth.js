const express = require('express') 
const router = express.Router()  
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken=require('../middleware/auth')

const User = require('../models/User')

router.get('/' , verifyToken , async(req , res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if(!user) return res.status(400).json({success:false , message: 'user not found'})
        res.json({success:true , user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'internal server error'})
    }
} )


router.post('/register' ,async (req , res) => {
    const {username , password} = req.body
    //const username = req.body.username
    // const password = req.body.password
    if(!username || !password) 
        return res
        .status(400)
        .json({success:false , message: 'Missing username and/or password'})

    try {
            //check trong db co use and password ?
            const user=await User.findOne({username })
            if(user) 
            return res.status(400).json({success:false , message:'username already taken'})
            //all good
            
            const hashedPassword = await argon2.hash(password)
            const newUser = new User({username , password: hashedPassword})
            
            await newUser.save()

            //return token 

            const accessToken= jwt.sign({userId: newUser._id},process.env.ACCESS_TOKEN)
            res.json({success:true , message: 'User creater successfully',accessToken})
            
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'server bi loi regster'})
    }
        
}
)
// POST LOGIN   
router.post('/login' ,async (req , res) => {
    const {username , password} = req.body

    if(!username || !password) 
        return res
        .status(400)
        .json({success:false , message:'Missing username or password!'})

        try {
            //check trong db co use and password ?
            const user=await User.findOne({username })
            if(!user) 
            return res.status(400).json({success:false , message:'Incorrect uername or passwork'})
            
            
            const passwordInvalid = await argon2.verify(user.password ,password)
            if(!passwordInvalid)
            return res.status(400).json({success:false , message:'Incorrect username or password'})
            
            // all good
            //return token 

            const accessToken= jwt.sign({userId: user._id},process.env.ACCESS_TOKEN)
            res.json({success:true , message: 'User login successfully',accessToken})
            

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'server bi loi'})
    }

})


module.exports=router

