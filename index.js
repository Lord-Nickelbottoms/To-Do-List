const express = require('express');

// used to read JSON data sent from client applications
const bodyParser = require('body-parser');

// to connect to PostgreSQL
const pg = require('pg');

const app = express()
const port = process.env.PORT || 3000

// use the body-parser module to accept and read JSON data in incoming requests
app.use(bodyParser.json())