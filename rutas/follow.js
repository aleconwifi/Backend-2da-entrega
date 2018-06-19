'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');
var app = express.Router();
var md_auth = require('../middlewares/autenticacion');

app.post('/follow', md_auth.verificaToken, FollowController.saveFollow);
app.delete('/follow/:id', md_auth.verificaToken, FollowController.deleteFollow);
app.get('/following/:id?/:page?', md_auth.verificaToken, FollowController.getFollowingUsers);
app.get('/followed/:id?/:page?', md_auth.verificaToken, FollowController.getFollowedUsers);
app.get('/get-my-follows/:followed?', md_auth.verificaToken, FollowController.getMyFollows);



module.exports = app;