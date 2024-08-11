const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.Port || 5000;

//Middleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a2hiq5c.mongodb.net/?appName=Cluster`;

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

    const AssignmentCollection = client.db("usersDB").collection("users");


    app.get('/allAssignment', async(req, res) => {
      const cursor =AssignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

      // Updating assignment
      app.get('/allAssignment/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await AssignmentCollection.findOne(query);
        res.send(result);
      })


    app.post('/allAssignment', async(req, res) =>{
      const assignment = req.body;
      console.log('All assignment data : ', assignment);
      const result = await AssignmentCollection.insertOne( assignment)
      res.send(result);

    })

    app.put('/allAssignment/:id', async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true};
      const updatedAssignment = req.body;
      const assignment = {
        $set: {
          name: updatedAssignment.name, 
          img:updatedAssignment.img, 
          level: updatedAssignment.level, 
          mark: updatedAssignment.mark, 
          date: updatedAssignment.date, 
          description: updatedAssignment.description
        }
      }
      const result = await AssignmentCollection.updateOne(filter, assignment, options);
      res.send(result);
    })

    app.delete('/allAssignment/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await AssignmentCollection.deleteOne(query)
      res.send(result);

    })

  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('AcademicNest Server is running')
})


app.listen(port, ()=>{
    console.log(`Server is running on Port : ${port}`)
})