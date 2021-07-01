const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const decoder = require('./services/AuthTokenDecoder');
const socketIo = require('socket.io');
const webSockets = require('./services/WebSockets');
require('dotenv').config();

// Mongoose setup setup
const MONGODB_URL = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jangledb.wsxym.mongodb.net/jangleDB?retryWrites=true&w=majority`;

const CONNECTION_URL = `mongodb://localhost:27017/jangle`;
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

// This outputs coloured logs as per the request/res code
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
app.use('/room',decoder, roomRouter);
app.use('/user',decoder, userRouter);


// Final error handler
app.use('*', function(err, req, res, next){
    return res.status(404).json({
        success : false,
        error : (err.message ?? err),
    });
});



const port = process.env.PORT || "5000";
const server = require('http').createServer(app);
server.listen(port);


const WebSockets = new webSockets();
global.io = socketIo(server);
global.io.on('connection', WebSockets.connection);

server.on('listening', () => {
    console.log(`Listening on port:: ${port}/`);
});
