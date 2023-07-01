const connectToMongo = require('./db');
const express = require('express');

connectToMongo();

const app = express();

app.use(express.json()); //inorder to use req.body : we required middleware.

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log("Hello ...");
})
app.listen(5500);
