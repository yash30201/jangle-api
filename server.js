const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Mongoose setup setup
const CONNECTION_URL = `mongodb://${process.env.DB_URL}/${process.env.DB_NAME}`;
console.log(CONNECTION_URL);
mongoose.connect(CONNECTION_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

mongoose.connection.on('connected', () => console.log('MongoDB connected!'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected!'));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected!'));
mongoose.connection.on('error', () => console.log('MongoDB cannot connect!'));


// Middlewares
//
const app = express();

// CORS configured for all origins and 4 methods
app.use(cors({
    origin : '*',
    methods : ['GET', 'PUT', 'POST', 'DELETE']
}));

// This outputs colored logs as per the request/res code
app.use(morgan('dev'));

// Body parsing 
app.use(express.json());
app.use(express.urlencoded({extended : true}));


//Routers
//
const authRouter = require('./routers/AuthRouter');
const roomRouter = require('./routers/roomRouter');
const userRouter = require('./routers/userRouter');


app.use('/',authRouter);
app.use('/room', roomRouter);
app.use('/user', userRouter);


// Final error handeller
app.use('*', function(err, req, res, next){
    return res.status(404).json({
        success : false,
        error : (err.message ?? err),
    });
});



const port = process.env.PORT || "5000";
const server = require('http').createServer(app);
server.listen(port);

server.on('listening', () => {
    console.log(`Listening on port:: ${port}/`);
});
