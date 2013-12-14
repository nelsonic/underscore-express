var express = require("express");

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'tmpl');

require('underscore-express')(app);

app.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Insert Imaginative Page Tilte Here',
        name: 'Stranger'
    });
});

app.listen(8000);
console.log('App listening at: http://localhost:8000/');