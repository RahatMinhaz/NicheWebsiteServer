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
        // Creating Database
        await client.connect();
        const database = client.db('car_dealership');
        const carCollection = database.collection('carscollection');
        const anotherCarCollection = database.collection('carscollection2');
        const userInfo = database.collection('usersinfo');
        const userInfo2 = database.collection('usersinfo2');
        const usersCollection = database.collection('users');
        // Getting User info
        app.get('/usersinfo', async(req,res) =>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = userInfo.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        });
        // Sending info to Database
        app.post('/usersinfo', async(req,res) =>{
            const info = req.body;
            const result = await userInfo.insertOne(info);
            res.json(result)
        });

        // Managing all orders data
        app.get('/usersinfo', async(req,res) =>{
            const cursor = userInfo2.find({});
            const orders2 = await cursor.toArray();
            res.send(orders2);
        });

        // Posting all ordered items on UI

        app.post('/usersinfo', async(req,res) =>{
            const info2 = req.body;
            const result = await userInfo2.insertOne(info2);
            res.json(result);
        });

        // Deleting an order

        app.delete('/usersinfo/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userInfo2.deleteOne(query);
            res.json(result);
        });

        // car api
        app.get('/carscollection', async(req,res) =>{
            const cursor = carCollection.find({});
            const wheels = await cursor.toArray();
            res.send(wheels);
        });
        // getting single api
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

        // Adding a new product on home page
        app.post('/carscollection2', async(req,res) =>{
            const newItem = req.body;
            const result = await anotherCarCollection.insertOne(newItem);
            res.json(result);
        });

        app.post('/carscollection', async(req,res) =>{
            const newItem = req.body;
            const result = await carCollection.insertOne(newItem);
            res.json(result);
        });

        app.delete('/carscollection2/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await anotherCarCollection.deleteOne(query);
            res.json(result);
        });

        app.delete('/carscollection2/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await carCollection.deleteOne(query);
            res.json(result);
        });


            // sending admin confirmation
        app.get('/users/:email', async(req,res) =>{
            const email = req.params.email;
            const query={email:email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
        });

        app.post('/users', async(req,res) =>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
            // Upserting user
        app.put('/users', async(req,res) =>{
            const user = req.body;
            const filter = {email:user.email};
            const options = { upsert: true };
            const updateDoc = {$set:user};
            const result = await usersCollection.updateOne(filter,updateDoc,options);
            res.json(result);
        });

        app.put('/users/admin', async(req,res) =>{
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set:{role: 'admin'}};
            const result = await usersCollection.updateOne(filter,updateDoc);
            res.json(result);
        });
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