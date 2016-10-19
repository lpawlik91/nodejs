var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');


var urlencodedParser = bodyParser.urlencoded({ extended: false })
var booksPath = __dirname + "/" + "books.json";

var INITIAL_LIMIT = 10;
var nextElem = INITIAL_LIMIT;
	
var allElementsFromDb = [];
	
var Action = {
	
	getListBooks : function (req, res) {

		fs.readFile( booksPath, 'utf8', function (err, data) {
			data = JSON.parse( data );
			//console.log( data );
			allElementsFromDb = [];
			for (var key in data) {
			  if (data.hasOwnProperty(key)) {
				allElementsFromDb.push( data[key] );
			  }
			}
			
			var limitedNumberOfForFirstReq = allElementsFromDb.length > INITIAL_LIMIT ? allElementsFromDb.slice(0, INITIAL_LIMIT) : allElementsFromDb.length;
			nextElem = limitedNumberOfForFirstReq.length;
			
			res.render("listOfBooks", {
				books : limitedNumberOfForFirstReq
			});
		});
	
	 
	},
	getAddingBookForm : function(req, res) {
		res.render("addBookForm");
	},	
	postAddBook : function (req, res) {
		var toAdd = { 
			title:req.body.title,
			author:req.body.author,
			cover:req.body.cover

		};
		Action.readBooksFromFile(req, res, toAdd);
	},
	readBooksFromFile : function (req, res, toAdd) {
		fs.readFile( booksPath, 'utf8', function (err, data) {
			data = JSON.parse( data );
			data[req.body.title] = toAdd;
			//console.log( data );
			Action.dumpNewBooksFile(res, data);

		});
	},
	dumpNewBooksFile : function (res, data) {
		fs.writeFile(booksPath, JSON.stringify(data), function(err) {
			if(err) {
				return console.log(err);
			}
			console.log("The file was saved!");
			res.end( JSON.stringify(data));
		}); 
	},
	getIndexHtml : function (req, res) {
		res.render("index");
	},
	next : function (req, res) {
		if(nextElem < allElementsFromDb.length) 
			res.end(JSON.stringify(allElementsFromDb[nextElem++]));
		else
			res.end(null);
	}
	
};

app.get('/listBooks', Action.getListBooks);
app.get('/next', Action.next);
app.get('/', Action.getIndexHtml);
app.get('/addBookForm', Action.getAddingBookForm);
app.post('/addBook', urlencodedParser, Action.postAddBook);


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Listening at http://%s:%s", host, port)
});
