const { Server, Socket } = require('socket.io');
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

module.exports = (server)=>{

    const io = new Server(server);
    //user verify token middleware
    io.use(async function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
            jwt.verify(socket.handshake.query.token, process.env.JWT_SEC, (err, user) => {
                if (err) console.error("Token is not valid");
                else {
                    console.log(user)
                    socket.user = user;
                    socket.post_id = socket.handshake.query.post_id;
                    next();
                }
            });
        }
      });
      
      io.on('connection',(socket)=>{
        io.emit('chat message',`${socket.user.user_id} entered`);
        socket.join(socket.post_id);

        socket.on('chat message', (msg) => {
            console.log(socket.post_id)
            if(socket.post_id ===''){
                io.emit('chat message', "전체 메시지" + msg);
            }else{
                socket.to(socket.post_id).emit('chat message', `${socket.user.user_id} : ${msg}`);
                socket.emit('chat message', `me : ${msg}`)
            }
            
        });

        // socket.on('join room', (room,cb)=>{
        //     socket.join(room);
        //     cb(`You joined ${room}`)
        // })
    });

    // io.on('connection',(socket)=>{
    //     console.log('a user connected! ');
    //     socket.broadcast.emit('chat message','hi');
    //     // io.emit('chat message', "new user entered");

    //     socket.on('disconnect',()=>{
    //         console.log('user disconnect');

    //     });

    //     socket.on('chat message', (msg) => {
    //         io.emit('chat message', msg);
    //     });
    // });
}