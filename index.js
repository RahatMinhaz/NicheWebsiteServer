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
        const userInfo = database.collection('usersinfo');
        const usersCollection = database.collection('users');

        app.get('/usersinfo', async(req,res) =>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = userInfo.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })

        app.post('/usersinfo', async(req,res) =>{
            const info = req.body;
            const result = await userInfo.insertOne(info);
            res.json(result)
        })

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
        });

        app.post('/users', async(req,res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        app.put('/users', async(req,res) =>{
            const user = req.body;
            const filter = {email:user.email};
            const options = { upsert: true };
            const updateDoc = {$set:user};
            const result = await usersCollection.updateOne(filter,updateDoc,options);
            res.json(result);
        });

        app.put('/users/admin'),async(req,res) =>{
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set:{role: 'admin'}};
            const result = await usersCollection.updateOne(filter,updateDoc);
            res.json(result);
        }
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