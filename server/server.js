var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.get('/listBooks', function (req, res) {
   fs.readFile( __dirname + "/" + "books.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})





// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.get('/add_book.html', function (req, res) {
   res.sendFile( __dirname + "/" + "add_book.html" );
})

app.post('/addBook', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
 //  var test = req.body.title;
	 toAdd = { 
      title:req.body.title,
      author:req.body.author,
	  cover:req.body.cover
	
		};
      var dataToSave;
  fs.readFile(__dirname + "/" + "books.json" , 'utf8', function (err, data) {
	  

      data = JSON.parse( data );
      data[req.body.title] = toAdd;
	  dataToSave = data;
      console.log( data );
	  
	fs.writeFile(__dirname + "/" + "books.json", JSON.stringify(data), function(err) {
		if(err) {
			return console.log(err);
		}

		console.log("The file was saved!");
		res.end( JSON.stringify(data));
	}); 
      
   });
   
   

})


var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Listening at http://%s:%s", host, port)
})
