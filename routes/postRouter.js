const router = require('express').Router();
const postService = require('../services/postService')
const {verifyToken, verifyTokenAndAuthorization} = require('../services/verifyToken');

//get all posts
router.get('/:id',verifyTokenAndAuthorization,async (req,res)=>{
    try{
        const post = await postService.getAllPostsById(req.params.id);
        res.send(post);
    }catch(err){
        console.error(err);
        res.status(501).json(err);
    }
});

//upload post
router.post('/',verifyTokenAndAuthorization,async (req,res)=>{
    try{
        const newPost = await postService.uploadPost(req.body);
        res.send(newPost);
    }catch(err){
        console.error(err);
        res.status(501).json(err);
    }
});

//enroll user into post 
router.post('/enroll',verifyTokenAndAuthorization, async(req,res)=>{
    try{
        const result = await postService.enrollUser(req.body);
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(501).json(err);
    }
});
module.exports = router;