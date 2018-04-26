//requiring all dependencies
const express     = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser  = require('body-parser');
const db          = require('./config/db');
const mongoose    = require("mongoose");
//initialize express app
const app = express();


const port = 8000;

//use body parser for parsing requests
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(db.url);

//initializing routes
require("./app/routes")(app, mongoose.connection);

//listen on port 
app.listen(port, () => {
	console.log("litening on port " + port + "...")
});

/*
//connecting MongoCLient database
MongoClient.connect(db.url, (err, database) => {
	if(err) return console.log(err);
	//listen on port 
	app.listen(port, () => {
		console.log("litening on port " + port + "...")
	})
})
*/