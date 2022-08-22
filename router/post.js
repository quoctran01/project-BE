const express = require('express')

const router = express.Router() 
const verifyToken = require('../middleware/auth')

const Post = require('../models/Posts')

router.get('/', verifyToken, async (req , res )=> {
try {
    const posts = await Post.find({user:req.userId}).populate('user', [
        'username','createdAt'])
    res.json({success:true , posts})
} catch (error) {
    console.log(error)
    res.status(500).json({success:false , message: ' lỗi'})
}})

router.post('/',verifyToken, async(req , res) => {
    const {title,description,url,status} = req.body

    if(!title) 
    return res
    .status(400)
    .json({success:false , message:'Title is require'})

    try {
        const newPost = new Post({
            title ,
            description ,
            url : url.startsWith('https://') ? url : `https://${url}` , 
            status : status || 'TO LEARN' ,
            user: req.userId
        })
        await newPost.save() 
        res.json({success:true , message:'Happy learning' , post: newPost})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:'Internal server error'})
    }
} )

router.put('/:id' , verifyToken ,async (req , res) =>{
    const {title,description,url,status} = req.body 
    if(!title) 
    return res
        .status(400)
        .json({ success: false, message: 'Title is required' })
        try {
            let postUpdate = {
                title , 
                description : description || '' , 
                url : url.startsWith('https://') ? url : `https://${url}` , 
                status : status || 'TO LEARN'
            }

            const postUpdateCondition= {
                _id : req.params.id , 
                user : req.userId
            }
            postUpdate = await Post.findByIdAndUpdate(
                postUpdateCondition,
                postUpdate, 
                {new:true}
            )
            if (!postUpdate)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({
			success: true,
			message: 'Excellent progress!',
			post: postUpdate
		})
        } catch (error) {
            console.log(error)
		    res.status(500).json({ success: false, message: 'Internal server error' })
        }
})

router.delete('/:id' , verifyToken , async ( req , res)=> {
    try {
        /*const postDeleteCondition = {
            _id : req.params.id ,
            user: req.userId
        }*/

    const postDelete = await Post.findByIdAndDelete({_id : req.params.id ,
        user: req.userId})
    if(!postDelete)
    return res.status(401).json({
        success: false,
        message: 'delete faiel'
    })
    res.json({
        success: true,
        message: 'Excellent progress!',
        post: postDelete
    })
    } catch (error) {
        console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router