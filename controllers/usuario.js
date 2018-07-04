'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var Usuario = require('../models/usuario');
var Follow = require('../models/follow');
//var Publication = require('../models/publication');
//var jwt = require('../services/jwt');




//Devuelve datos de un usuario con la solicitud enviada
function getUser(req, res) {
    var userId = req.params.id;

    Usuario.findById(userId, (err, usuario) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!usuario) return res.status(404).send({ message: 'El usuario no existe' });

        followThisUser(req.usuario._id, userId).then((value) => {
            usuario.password = undefined; //para que no devuelva el password

            return res.status(200).send({
                usuario,
                following: value.following,
                followed: value.followed
            });
        });

    });
}

async function followThisUser(identity_user_id, user_id) {
    try {
        var following = await Follow.findOne({ usuario: identity_user_id, followed: user_id }).exec()
            .then((following) => {
                console.log(following);
                return following;
            })
            .catch((err) => {
                return handleerror(err);
            });
        var followed = await Follow.findOne({ usuario: user_id, followed: identity_user_id }).exec()
            .then((followed) => {
                console.log(followed);
                return followed;
            })
            .catch((err) => {
                return handleerror(err);
            });
        return {
            following: following,
            followed: followed
        }
    } catch (e) {
        console.log(e);
    }
}

//Devuelve todos los usuarios
// Devolver un listado de usuarios paginado
function getUsers(req, res) {
    var identity_user_id = req.usuario._id;

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 5;

    Usuario.find().sort('_id').paginate(page, itemsPerPage, (err, usuarios, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!usuarios) return res.status(404).send({ message: 'No hay usuarios disponibles' });

        followUserIds(identity_user_id).then((value) => {

            return res.status(200).send({
                usuarios,
                users_following: value.following,
                users_follow_me: value.followed,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });

        });

    });
}


async function followUserIds(user_id) {
    var following = await Follow.find({ "usuario": user_id }).select({ '_id': 0, '__v': 0, 'usuario': 0 }).exec((err, follows) => {
        return follows;
    });

    var followed = await Follow.find({ "followed": user_id }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec((err, follows) => {
        return follows;
    });

    // Procesar following ids
    var following_clean = [];

    following.forEach((follow) => {
        following_clean.push(follow.followed);
    });

    // Procesar followed ids
    var followed_clean = [];

    followed.forEach((follow) => {
        followed_clean.push(follow.usuario);
    });

    return {
        following: following_clean,
        followed: followed_clean
    }
}

function getCounters(req, res) {
    var userId = req.usuario._id;
    if (req.params.id) {
        userId = req.params.id;
    }

    getCountFollow(userId).then((value) => {
        return res.status(200).send(value);
    });
}

async function getCountFollow(user_id) {
    var following = await Follow.count({ "usuario": user_id }).exec((err, count) => {
        if (err) return handleError(err);
        return count;
    });

    var followed = await Follow.count({ "followed": user_id }).exec((err, count) => {
        if (err) return handleError(err);
        return count;
    });

    /*var publications = await Publication.count({"usuario":user_id}).exec((err, count) => {
    	if(err) return handleError(err);
    	return count;
    });*/

    return {
        following: following,
        followed: followed,
        //publications: publications
    }
}


module.exports = {

    getUser,
    getUsers,
    getCounters

}