const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app =express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.user_name}:${process.env.DB_Pass}@cluster0.noswvlt.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandsCollection = client.db('GadgetGeniusDB').collection('brands');
    app.get('/brands', async (req, res) => {
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })
    const productCollection = client.db('GadgetGeniusDB').collection('Products');
    const userCollection = client.db('GadgetGeniusDB').collection('user');
  

app.get('/products', async (req, res) => {
  const cursor = productCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})
app.post('/addProduct', async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  const result = await productCollection.insertOne(newProduct);
  res.send(result);
})
app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await productCollection.findOne(query);
  res.send(result);
})

app.post('/user', async (req, res) => {
  const user = req.body;
  console.log(user.MyCart);
  const result = await userCollection.insertOne(user);
  res.send(result);
});

app.put('/user', async (req, res) => {
  const user = req.body;
  const filter = { email: user.email }
  const updateDoc = {
      $set: {
        MyCart: user.MyCart
      }
  }
  const result = await userCollection.updateOne(filter, updateDoc);
  res.send(result);
})

app.get('/user/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email }
  const result = await userCollection.findOne(query);
  res.send(result);
})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('i am running')
})

app.listen(port,()=>{
    console.log(`server is running port:${port}`)
})