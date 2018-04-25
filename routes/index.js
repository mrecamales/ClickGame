var express = require('express');
var router = express.Router();
var Rx = require('rx');
var Jugador = require('../models/jugador');
var Partida = require('../models/partida');

var jugadors = [];
var colors = ["yellow", "red", "green", "blue"];
var partides = [];


/*
var User = require('../models/user');
var mid = require('../middleware');
*/

/* GET home. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'ClickGame', message: 'Benvingut a ClikGame!' });
});

/* GET registre. */
router.get('/registre', function (req, res, next) {
    res.render('registre');
});

/* POST registre. */
router.post('/registre', function (req, res, next) {
    var email = req.body.email
    var password = req.body.password

    var db = req.db;
    var collection = db.get('usuaris');

    collection.findOne({ email: email }, {}, function (e, doc) {
        console.log(doc)
        if (doc != null) {
            res.render('registre', { message: 'usuari ja registrat' });
        } else {
            collection.insert({ email: email, password: password })
            res.render('index', { title: 'ClickGame', message: 'Benvingut a ClikGame, ' + email });
        }
    });
});

/* GET login. */
router.get('/login', function (req, res, next) {
    res.render('login');
});

/* POST login. */
router.post('/login', function (req, res, next) {
    var email = req.body.email
    var password = req.body.password
    var partida;

    var db = req.db;
    var collection = db.get('usuaris');

    collection.findOne({ email: email, password: password }, {}, function (e, doc) {
        if (doc == null) {
            res.render('login', { message: 'usuari no registrat' });
        } else {
            collection.insert({ email: email, password: password })
            var jugador = new Jugador(email, password, colors[colors.length-1]);
            colors.pop();

            partida = partides[partides.length - 1];
            if (partida == null){
                partida = new Partida();
                
                partida.setJugador=jugador;
                partides.push(partida);
                console.log("primer jugador");
                console.log(partida);
            }else if (partida.getJugador.length != 2){
                partida.setJugador=jugador;
                console.log("jugadors senars");
                console.log(partida);
            }else{

                partida = new Partida();
                partida.setJugador=jugador;
                partides.push(partida);
                console.log("jugadors parells");
                console.log(partida);
            }
            console.log("abans d'anar a partida, num de jugadors:" + partida.getJugador.length)
            res.redirect('/partida');


            // fumada del 15
            // Converts an array to an observable sequence
            /*
            var source = Rx.Observable.from(jugadors).count();

            // Prints out each item
            var subscription = source.subscribe(
                x => numjugadors = x,
                e => console.log('onError: %s', e),
                () => console.log('onCompleted'));

            function waitFor(condition, callback) {
                if (condition != 2) {
                    console.log("waiting");
                    //res.render('login', { message: 'esperant resta de jugadors' });
                    res.redirect('/partida');
                } else {
                    console.log("done");
                    callback();
                }
            }
            */
        }
    });
});

/* GET partida. */
router.get('/partida', function (req, res, next) {
    var partida = partides[partides.length - 1];
    console.log("hola" + partides.length);
    console.log(partida.getJugador.length);

    console.log(partida.getJugador[0].color);
    
    if (partida.getJugador.length == 1){
        console.log("hola");
        partida.crearTaulell();
        
    }

    //hacer las celdas clickables
    //if click jugador element.style.backgroundColor del td = partida.getJugador[0].color

    

        
    res.render('partida', {
        title: 'ClickGame', message: 'benvingut a ClickGame, ', tr: partida.tr, td: partida.td,
        waiting: false,
    });
});


module.exports = router;