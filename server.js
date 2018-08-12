var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
var routerAPI = express.Router();
mongoose.connect('mongodb+srv://kamilica:9rc2iokhpPAPzYNG@filmovicluster-lygx2.mongodb.net/projekcije?retryWrites=true')
var db = mongoose.connection;
var Schema = mongoose.Schema;

var projekcijeSchema =new Schema({
    brojSale: String,
    datumProjekcije: Date,
    nazivFilma: String,
    cijenaKarte: Number,
    sjedista: [
        {
            brojSjedista: Number,
            stanje: Boolean,
            rezervacija: String
        }
    ]
    
})
var projekcije = mongoose.model('projekcije',projekcijeSchema,'projekcije');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routerAPI.get('/vratiListuProjekcija', function (req, res) {

    projekcije.find({}, function (err, data) {
        if (err) return handleError(err);
        console.log(data);
        res.send(data);
      });
})

routerAPI.get('/vratiListuProjekcijaFilma/:film', function (req, res) {

    var naziv = req.params.film;
    projekcije.find({nazivFilma: naziv}, function (err, data) {
        if (err) return handleError(err);
        res.send(data);
      });
})

routerAPI.get('/vratiListuProjekcijaUSali/:sala', function (req, res) {

    var broj = req.params.sala;
    projekcije.find({brojSale: broj}, function (err, data) {
        if (err) return handleError(err);
        res.send(data);
      });
})

routerAPI.post('/rezervacija/:brojSjedista', function (req, res) {

    var ime = req.body.ime;
    var prezime = req.body.prezime; 
    var id = req.body._id;
    var brojSjedista = req.params.brojSjedista;
    //var opts = { runValidators: true, context: 'query', new: true };

    projekcije.findOneAndUpdate({"_id": id, 'sjedista.brojSjedista':brojSjedista}, {'sjedista.$.rezervacija':ime+' '+prezime, 'sjedista.$.stanje': true}, {upsert: true}, function (err, data) {
        if (err) console.log(err);
        console.log('Rezervisano.');
        res.send('Rezervisano.');
      });
})


routerAPI.post('/dodajSjediste', function(req,res){
    var id  = req.body.id;
    var brSjedista = req.body.brojSjedista;
     
    projekcije.findOneAndUpdate({'_id': id}, {$push:{'sjedista':{'brojSjedista': brSjedista, 'stanje': false}}}, {upsert: true}, function (err, data) {
        if (err) return handleError(err);
        console.log('Dodano sjediste.');
        res.send('Dodano sjediste.');
      });

})

routerAPI.post('/ponistavanjeRezervacije/:id/:brojSjedista', function (req, res) {

    var id  = req.params.id;
    var brojSjedista = req.params.brojSjedista;
    //var opts = { runValidators: true, context: 'query', new: true };

    projekcije.findOneAndUpdate({'_id': id, 'sjedista.brojSjedista':brojSjedista}, {'sjedista.$.rezervacija':'', 'sjedista.$.stanje': false}, {upsert: true}, function (err, data) {
        if (err) return handleError(err);
        console.log('Rezervacija je poništena.');
        res.send('Rezervacija je poništena.');
      });
})
app.use('/api', routerAPI);

var server = app.listen(8086, function () {
   var host = server.address().address
   var port = server.address().port
   
})
