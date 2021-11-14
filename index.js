const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const {MongoClient} = require('mongodb');
const ObjectId = require("mongodb").ObjectId;


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h4bqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('car_dealership');
        const carCollection = database.collection('carscollection');
        const anotherCarCollection = database.collection('carscollection2');

        app.get('/carscollection', async(req,res) =>{
            const cursor = carCollection.find({});
            const wheels = await cursor.toArray();
            res.send(wheels);
        });
        app.get('/carscollection/:id', async (req,res) =>{
            const result = await carCollection.find({_id: ObjectId( req.params.id )})
            .toArray();
            res.send(result[0]);
        })
        app.get('/carscollection2', async(req,res) =>{
            const cursor = anotherCarCollection.find({});
            const secondWheels = await cursor.toArray();
            res.send(secondWheels);
        });
        app.get('/carscollection2/:id', async(req,res) =>{
            const result = await anotherCarCollection.find({_id: ObjectId( req.params.id )})
            .toArray();
            res.send(result[0]);
        })
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Car Dealership!')
})

app.listen(port, () => {
    console.log(` listening at ${port}`)
})