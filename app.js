const express = require("express");
const path = require("path");
const morgan = require("morgan");
// const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(morgan('dev'));
app.set("port", process.env.PORT || 3001);
app.set("view engine", "html");
// nunjucks.configure("views", {
// 	express: app,
// 	watch: true,
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
});
app.get('/chat',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/chat.html'));
}
)

const authRouter = require('./routes/auth');
// const { verifyToken , verifyTokenAndAuthorization} =require('./services/verifyToken');
app.use('/auth',authRouter);
app.use('/post',require('./routes/postRouter'));
app.use('/chat',require('./routes/chatRouter'));
// 404 
app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
  });

// error router
app.use((err, req, res, next) => {
    console.error(err);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.send("error")
});

const server = app.listen(app.get('port'),()=>{
    console.log('listening on port ' + app.get('port'));
})

//web socket server on
const webSocket = require('./socket');
webSocket(server)