const express = require('express');
const app = express();
const http = require('http').Server(app);
var fs = require('fs');
var grpc = require('grpc');
var lnrpc = grpc.load('rpc.proto').lnrpc;
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


const LND_DIR = '/home/emilio/.lnd';
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
var lndCert = fs.readFileSync(LND_DIR + '/tls.cert');
var sslCreds = grpc.credentials.createSsl(lndCert);
var macaroonCreds = grpc.credentials.createFromMetadataGenerator(function (args, callback) {
    var macaroon = fs.readFileSync(LND_DIR + "/data/chain/bitcoin/testnet/admin.macaroon").toString('hex');
    var metadata = new grpc.Metadata();
    metadata.add('macaroon', macaroon);
    callback(null, metadata);
});
var creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
var lightning = new lnrpc.Lightning('localhost:10009', creds);
var request = {
    add_index: 1
};

io.on('connection', function (socket) {
    console.log("connected");
    var call = lightning.subscribeInvoices(request);
    call.on('data', function (response) {
        io.emit('message', response);
    });
    call.on('status', function (status) {
    });
    call.on('end', function () {

    });
});

http.listen(3000);