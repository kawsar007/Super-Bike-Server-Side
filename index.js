const express = require('express');
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors');
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
        console.log(purchaes, "purchaes");
        res.json(result);
    })

    // GET Purchaes
    app.get('/purchaes', async (req, res) => {
        const cursor = purchaesCollection.find({});
        const purchaes = await cursor.toArray();
        res.send(purchaes);
    })

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

// dbBike
// rkpEf0sOt8uJ3O2L