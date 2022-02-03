const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


//get all posts
const getAllPostsById = async function(user_id){
    const posts = await prisma.post.findMany({
        where :{
            user_id
        },
        select:{
            title:true,
            post:true,
            user_id:true
        }
    });
    return posts;    
}

//uploadPost
const uploadPost = async function(reqBody){
   const {title, post, user_id} = reqBody;
   const userExists = await prisma.user.findFirst(
    {
        where:{
            userId: user_id
        },
        select:{
            id:true
        }
    });
    if(!userExists){
        return res.status(400).json({
            msg: "user does not exist"
        })
    }
    console.log('userExists.id' + userExists.id);
    
    const newPost = await prisma.post.create({
        data :{
            user_id: userExists.id,
            title,
            post
        },
        select:{
            id:true,
            title: true,
            post : true,
            created_at: true,
            updated_at: true
        }
    });
    //post 1대1 관계 채팅방 생성
    const newChat = await prisma.chat.create({
        data:{
            post_id: newPost.id
        }
    });
    
    return newPost;
}
module.exports = { getAllPostsById,
                    uploadPost }