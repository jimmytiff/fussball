var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Start a career in the world of football";

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline
    });
});

app.get('/league', function(req, res) {
    var pg = require('pg');          
    var conString = process.env.DATABASE_URL ||  "postgres://localhost:5000/quiet-falls-3456";
    var client = new pg.Client(conString);
    client.connect();

    var query = client.query("select * from league");
    query.on("row", function (row, result) { 
      result.addRow(row); 
    });   
    query.on("end", function (result) {          
        client.end(); 
        res.write('Success');
        res.end();  
    });
  res.render('pages/league');
});

app.get('/fixtures', function(req, res) {
  res.render('pages/fixtures');
});

app.get('/club', function(req, res) {
  res.render('pages/club');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


 

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM league', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
})