const HOME_DIR = require('os').homedir();
const LND_DIR = HOME_DIR + '/.lnd';
var fs = require('fs');
var grpc = require('grpc');
var lnrpc = grpc.load('rpc.proto').lnrpc;
const network = 'testnet';

process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
var lndCert = fs.readFileSync(LND_DIR + '/tls.cert');
var sslCreds = grpc.credentials.createSsl(lndCert);
var macaroonCreds = grpc.credentials.createFromMetadataGenerator(function (args, callback) {
    var macaroon = fs.readFileSync(LND_DIR + "/data/chain/bitcoin/" + network + "/invoice.macaroon").toString('hex');
    var metadata = new grpc.Metadata();
    metadata.add('macaroon', macaroon);
    callback(null, metadata);
});
var creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
var lnd = new lnrpc.Lightning('localhost:10009', creds);


var api = {
    addInvoice: function (memo, callback) {
        lnd.addInvoice({memo: memo, value: 1}, callback);
    }

};

module.exports = api;