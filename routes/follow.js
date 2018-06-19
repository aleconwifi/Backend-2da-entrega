'use strict'

var express = require('express');
//var mongoosePaginate = require('mongoose-pagination');

var jwt = require('jsonwebtoken');
var path = require('path');
var fs = require('fs');


var mdAutenticacion = require('../middlewares/autenticacion');
var mdAuth = require('../middlewares/authenticated');



var app = express();


var Follow = require('../models/follow');
var Usuario = require('../models/usuario');



//PRUEBA
app.get('/', mdAutenticacion.verificaADMIN_o_MismoUsuario, (req, res) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});
/*
// GUARDAR FOLLOWS FUNCION SAVEFOLLOWS
app.post('/', mdAuth.ensureAuth, (req, res) => {

    var params = req.body;

    var follow = new Follow();
    follow.usuario = req.usuario.sub;
    follow.followed = params.followed;



    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar el seguimiento' });

        if (!followStored) return res.status(404).send({ message: 'El seguimiento no se ha guardado' });

        return res.status(200).send({
            follow: followStored
        });
    });


});
*/

module.exports = app;