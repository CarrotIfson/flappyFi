require('dotenv').config();
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000, 
    bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    req.setTimeout(1000*45, function () {
        res.status(200).json(helper.APIReturn(1, "timeout"));
    });
    next();;
});

var routes = require('./routes/APIRoutes');
routes(app);
app.listen(port);
console.log("Floppy Bird API started on: " + port);