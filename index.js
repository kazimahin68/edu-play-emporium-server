const express = require('express');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j52gohc.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();

        const toyCollection = client.db('eduPlayEmporium').collection('toys')
        const woodenToyCollection = client.db('eduPlayEmporium').collection('wooden-toys')


        // New Toys Add
        app.post('/toys', async (req, res) => {
            const newToy = req.body;
            const result = await toyCollection.insertOne(newToy)
            res.send(result)
        })

        // get toy by email
        app.get('/toys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toyCollection.find(query).toArray()
            res.send(result);
        })

        // get toy data
        app.get('/toys', async (req, res) => {
            const result = await toyCollection.find().toArray()
            res.send(result)
        })

        // get a toy by id
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query)
            res.send(result)
        })

        // get data from wooden toy collection
        app.get('/wooden-toys', async(req,res) => {
            const result = await woodenToyCollection.find().toArray()
            res.send(result)
        })

        // Delete order
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query)
            res.send(result)
        })

        // Update Data
        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const updateToy = req.body;
            console.log(updateToy)
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const toy = {
                $set: {
                    price: updateToy.price,
                    quantity: updateToy.quantity,
                    details: updateToy.details
                }
            }
            const result = await toyCollection.updateOne(filter, toy, option);
            res.send(result)
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

app.get('/', (req, res) => {
    res.send('My EduPlay Emporium server is running')
})

app.listen(port, () => {
    console.log(`EduPlay Emporium server is running at PORT: ${port}`)
})