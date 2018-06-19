'use strict'

var express = require('express');
var UserController = require('../controllers/usuario');

var app = express.Router();
var md_auth = require('../middlewares/autenticacion');


app.get('/usuario/:id', md_auth.verificaToken, UserController.getUser);
app.get('/usuarios/:page?', md_auth.verificaToken, UserController.getUsers);
app.get('/counters/:id?', md_auth.verificaToken, UserController.getCounters);



module.exports = app;