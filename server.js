const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.get('/', (req, res) => {
    res.status(200).json({'success' : true});
});


const port = process.env.PORT || "5000";
const server = require('http').createServer(app);
server.listen(port);

server.on('listening', () => {
    console.log(`Listening on port:: ${port}/`);
});
