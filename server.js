/**
 * @fileoverview This file is just for an express server run everytime `npm start` is executed at the cmd.
 * @author Rex Von Brixon Aparece Apa-ap
 * @version 1.0.0
 */

const express = require('express');
const http = require('http');
const app = express(); 
const server = http.createServer(app); 

server.listen(5500, function() {
  console.log("View the project at http://127.0.0.1:5500/src/")
});


app.get('/', function(req, res) {
  res.sendFile(__dirname + 'index.html');
});

app.use(express.static(__dirname));
