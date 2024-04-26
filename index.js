const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


app.get("/", async(req, res)=>{
    res.send("Art server is Running");
})

app.listen(port, ()=>{
    console.log(`Art Server is running from port: ${port}`)
})