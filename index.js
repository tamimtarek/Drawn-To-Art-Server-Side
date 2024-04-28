const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tvuzkq3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const craftCollection = client.db("craftDB").collection("craft");
    const subcategoryCollection = client.db("subcategoryDB").collection("subcategory");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    
    app.get('/crafts/:email', async(req, res)=>{
      console.log(req.params.email);
      const result = await craftCollection.find({email: req.params.email}).toArray();
      res.send(result);
    })
    app.get('/crafts//:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.findOne(query);
      res.send(result);
    })
    app.post("/crafts", async (req, res) => {
      const craft = req.body;
      const result = await craftCollection.insertOne(craft);
      res.send(result);
    })

    app.put("/crafts/:id", async(req, res)=>{
      const id = req.params.id;
      console.log(id);
      const filter = {_id: new ObjectId(id)};
      const option = {upsert: true};
      const updateCrafts = req.body;
      console.log(updateCrafts);
      const craft = {
        $set: {
          itemName: updateCrafts.itemName,
          subcategory: updateCrafts.subcategory,
          price: updateCrafts.price,
          description: updateCrafts.description,
          rating: updateCrafts.rating,
          customization: updateCrafts.customization,
          photoURL: updateCrafts.photoURL,
          processing_time: updateCrafts.processing_time,
          stockStatusphotoURL: updateCrafts.stockStatus
        }
      };
      const result = await craftCollection.updateOne(filter, craft, option);
      res.send(result)
    })

    app.get("/subcategory", async(req, res)=>{
      const cursor = subcategoryCollection.find();
      console.log(cursor)
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/subcategory/:subcategory_name', async(req, res)=>{
      const result = await subcategoryCollection.find({subcategory_name: req.params.subcategory_name}).toArray();
      res.send(result);
    })
    app.delete("/crafts/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged yourr deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
  res.send("Art server is Running");
})

app.listen(port, () => {
  console.log(`Art Server is running from port: ${port}`)
})