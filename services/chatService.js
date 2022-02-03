const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


//get all user chat list
const getUserChatList = async function(params){
    const userId = params.id;
    const list = await prisma.user.findUnique({
        where:{
            userId
        },
        include:{
            userEnroll:{
                include:{
                    post:true
                }
            }
        }
    });
    const {password,id,...others} = list;
    console.log(others)
    return others;
}

module.exports = {getUserChatList}