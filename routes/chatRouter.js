const router = require('express').Router();
const {getUserChatList} = require('../services/chatService')
const {verifyToken, verifyTokenAndAuthorization} = require('../services/verifyToken');


//get all user chat list
router.get('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    try{
        console.log("★",req.params.id)
        const result =await getUserChatList(req.params);
        res.json(result);
    }catch(err){
        console.error(err);
        res.status(501).json(err);
    }
})



module.exports = router