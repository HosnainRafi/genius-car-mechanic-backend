const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

var cors = require('cors');
require("dotenv").config();


const app = express();
//Middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vdirb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");

        //Get Api
        app.get('/services',async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        //Get Single Service
        app.get('/services/:id',async (req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //Post Api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);

            const result = await servicesCollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);

            res.send(result);
        })

        //delete Api
        app.delete('/services/:id', async (req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('hello World my bro');
});

app.get('/hello',(req,res) => {
    res.send('Hello My friend')
})

app.listen(port, () => {
    console.log('Port is Running');
})