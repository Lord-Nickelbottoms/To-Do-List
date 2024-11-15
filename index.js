const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion} = require('mongodb');

// used to read JSON data sent from client applications
const bodyParser = require('body-parser');

// to bypass cross-origin request errors
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

// cors enable headers
app.use(cors())

// use the body-parser module to accept and read JSON data in incoming requests
// this is Middleware
app.use(bodyParser.json())

// MongoDB config
const url = 'mongodb+srv://superuser:BHLArNu4nDnnqhUO@cluster0.hmfb7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const client = new MongoClient(url)
const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

let toDoCollection;

const databaseConnection = async  () => {
    try {
        await client.connect()
        const database = client.db('ToDoDatabase');
        toDoCollection = database.collection('tasks');
        console.log(`Connected to MongoDB and ${toDoCollection} collection is ready`)
    } catch (error) {
        console.error(`Failed to connect to MongoDB: ${error}`);
    }
}

// GET request
app.get('/api/tasks', async (request, response) => {
    try {
        const taskList = await toDoCollection.find( {} ).toArray()

        for (let i = 0; i < toDoCollection.length; i++) {
            console.log('collections: ' + toDoCollection[i])
            response.end('collections: ' + toDoCollection[i])
        }
        
        response.json(taskList)
    } catch (e) {
        response.status(500).json({ error: `An error has occurred: ${e}`})
    }
})

// POST request to add a new task
app.post('/api/new-task', async (request, response) => {
    const { title, description } = request.body;
    if (!title) {
        return response.status(400).json({ error: 'A task title is required' });
    }

    const newTask = {
        title,
        description,
        status: 'active',
    };

    try {
        const result = await toDoCollection.insertOne(newTask);
        response.status(201).json(result.ops[0]);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
});

// PUT request to mark as completed
app.put('/api/update-task/:id', async (request, response) => {
    const { id } = request.params;
    const objectId = new ObjectId(id)


    if (!id) {
        return response.status(404).json({ error: 'That ID does not exist. Please try again.' });
    }

    try {
        const result = toDoCollection.updateOne(
            { '_id': objectId },
            { $set: { status: 'completed' } }
        );

        response.json({ message: 'Task updated successfully', result });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Error updating record' });
    }
});

// PUT request to edit task data
app.put('/api/edit-task/:id', async (req, res) => {
    const { id } = req.params; //
    const { title, description } = req.body;

    
    if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    try {
        const result = await toDoCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: title,
                    description: description,
                },
            }
        );

        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Task not found or no changes made.' });
        }

        
        res.json({ message: 'Task updated successfully', result });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Server error while updating the task' });
    }
});

// DELETE request
app.delete('/api/delete-task/:id', async (request, response) => {
    const { id } = request.params;
    try {
        const result = await toDoCollection.deleteOne({_id: new ObjectId(id) });
        response.json(result);
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
})


app.listen(port, async () => {
    await databaseConnection();
    console.log(`Server running on http://localhost:${port}`);
});