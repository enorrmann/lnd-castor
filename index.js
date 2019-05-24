const express = require('express');
const app = express();
const http = require('http').Server(app);
var html_dir = "./public_html";
var path = require('path');
const io = require('socket.io')(http);

app.get('/*.js', function (req, res) {
    res.sendFile(path.join(__dirname, html_dir, req.url));
});
app.get('/*.css', function (req, res) {
    res.sendFile(path.join(__dirname, html_dir, req.url));
});
app.get('/*.html',
        function (req, res) {
            res.sendFile(path.join(__dirname, html_dir, req.url));
        });

app.get('/',
        function (req, res) {
            res.sendFile(path.join(__dirname, html_dir, 'index.html'));
        });



var lightning = require('./lnd.js');
var request = {
    //add_index: 1
};

//io.on('connection', function (socket) {
    console.log("connected");
    var call = lightning.subscribeInvoices(request);
    call.on('data', function (response) {
        io.emit('message', response);
    });
    call.on('status', function (status) {
    });
    call.on('end', function () {

    });
//});

http.listen(8280);