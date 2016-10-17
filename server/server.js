var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false })
var booksPath = __dirname + "/" + "books.json";
	
var Action = {
	
	getListBooks : function (req, res) {
	   fs.readFile( __dirname + "/" + "books.json", 'utf8', function (err, data) {
		  console.log( data );
		  res.end( data );
	   });
	},
	getAddingBookForm : function(req, res) {
		res.sendFile( __dirname + "/" + "add_book.html" );
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
			console.log( data );
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
	
	
};

app.get('/listBooks', Action.getListBooks);
app.get('/add_book.html', Action.getAddingBookForm);
app.post('/addBook', urlencodedParser, Action.postAddBook);


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Listening at http://%s:%s", host, port)
});
