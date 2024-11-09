const express = require('express');
const { MongoClient } = require('mongodb');

// used to read JSON data sent from client applications
const bodyParser = require('body-parser');

const app = express()
const port = process.env.PORT || 3000

// use the body-parser module to accept and read JSON data in incoming requests
// this is Middleware
app.use(bodyParser.json())

// MongoDB config
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url)

let toDoCollection;

const databaseConnection = async  () => {
    try {
        await client.connect()
        const database = client.db('myDatabase');
        toDoCollection = database.collection('tasks');
        console.log("Connected to MongoDB and 'tasks' collection is ready")
    } catch (error) {
        console.error(`Failed to connect to MongoDB: ${error}`);
    }
}

