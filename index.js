const express = require('express');
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gjlbc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('DB connection successfully');
        const database = client.db('superBike');
        const bikeCollection = database.collection('products');
        const purchaesCollection = database.collection('purchaes');
        const reviewsCollection = database.collection('reviews');

        // Get Products API
        app.get('/products', async (req, res) => {
            const cursor = bikeCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        // Purchaes Products
        app.post('/purchaes', async (req, res) => {
            const purchaes = req.body;
            const result = await purchaesCollection.insertOne(purchaes);
            // console.log(purchaes, "purchaes");
            res.json(result);
        })

        // GET Purchaes
        app.get('/purchaes', async (req, res) => {
            const cursor = purchaesCollection.find({});
            const purchaes = await cursor.toArray();
            res.send(purchaes);
        })

        // DELETE Purchase
        app.delete('/purchaes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await purchaesCollection.deleteOne(query)
            // console.log('Deleting user with id', result);
            res.json(result);
        })

        // Review Post API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            // console.log('Hit The Post Api', review);

            const result = await reviewsCollection.insertOne(review);
            // console.log(result);
            res.json(result)
        })

        // Get Reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        });

    } finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
