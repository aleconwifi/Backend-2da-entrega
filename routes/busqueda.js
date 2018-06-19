var express = require('express');

var app = express();

var Inmueble = require('../models/inmueble');
var Cliente = require('../models/cliente');
var Usuario = require('../models/usuario');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'clientes':
            promesa = buscarClientes(busqueda, regex);
            break;

        case 'inmuebles':
            promesa = buscarInmuebles(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, clientes y inmuebles',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarInmuebles(busqueda, regex),
            buscarClientes(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                inmuebles: respuestas[0],
                clientes: respuestas[1],
                usuarios: respuestas[2]
            });
        })


});


function buscarInmuebles(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Inmueble.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, inmuebles) => {

                if (err) {
                    reject('Error al cargar inmuebles', err);
                } else {
                    resolve(inmuebles)
                }
            });
    });
}

function buscarClientes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Cliente.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('inmueble')
            .exec((err, clientes) => {

                if (err) {
                    reject('Error al cargar clientes', err);
                } else {
                    resolve(clientes)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}



module.exports = app;