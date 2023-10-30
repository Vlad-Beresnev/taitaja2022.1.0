const path = require("path");
const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const { MongoClient } = require('mongodb'); // Import MongoDB MongoClient

// Connection URL for MongoDB
const mongoUrl = 'mongodb://localhost:27017'; // Replace with your MongoDB URL
const dbName = 'tutorial'; // Replace with your database name

// Create a new MongoClient instance
const mongoClient = new MongoClient(mongoUrl, { useNewUrlParser: true });

// Create an HTTP server
const app = http.createServer((req, res) => {
    if (req.url === '/json' && req.method === 'POST') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            try {
                const jsonPayload = JSON.parse(data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(jsonPayload));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON data');
            }
        });
    } else if (req.url === '/urlencoded' && req.method === 'POST') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const formData = querystring.parse(data);

            res.writeHead(200, { 'Content-Type': 'application/x-www-form-urlencoded' });
            res.end(JSON.stringify(formData));
        });
    } else if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Welcome To the CMS App');
    } else {
        const filePath = path.join(__dirname, 'public', req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
    }
});

// Connect to MongoDB
mongoClient.connect()
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('MongoDB Connection Failed', err);
  });