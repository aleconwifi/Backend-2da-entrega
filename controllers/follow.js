'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Usuario = require('../models/usuario');
var Follow = require('../models/follow');



function saveFollow(req, res) {
    var id = req.params.id;
    var params = req.body;

    var follow = new Follow();

    follow.usuario = req.usuario._id;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar el seguimiento' });

        if (!followStored) return res.status(404).send({ message: 'El seguimiento no se ha guardado' });

        return res.status(200).send({ follow: followStored });
    });

}

function deleteFollow(req, res) {
    var id = req.params.id;
    var userId = req.usuario._id;
    var followId = req.params.id;

    Follow.find({ 'usuario': userId, 'followed': followId }).remove(err => {
        if (err) return res.status(500).send({ message: 'Error al dejar de seguir' });

        return res.status(200).send({ message: 'El follow se ha eliminado!!' });
    });
}


function getFollowingUsers(req, res) { //son los que yo sigo
    var userId = req.usuario._id;

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;

    Follow.find({ usuario: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (!follows) return res.status(404).send({ message: 'No estas siguiendo a ningun usuario' });


        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows,

        });

    });
}

function getFollowedUsers(req, res) { //los que me estan siguiendo, muy parecido al following
    var userId = req.usuario._id;

    if (req.params.id && req.params.page) {
        userId = req.params.id;
    }

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    } else {
        page = req.params.id;
    }

    var itemsPerPage = 4;
    //busco en el followed el userID
    Follow.find({ followed: userId }).populate('usuario').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (!follows) return res.status(404).send({ message: 'No te sigue ningun usuario' });


        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            follows,
        });

    });
}


// Devolver listados de usuarios sin paginar
function getMyFollows(req, res) {
    var userId = req.usuario._id;

    var find = Follow.find({ user: userId });

    if (req.params.followed) {
        find = Follow.find({ followed: userId });
    }

    find.populate('usuario followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (!follows) return res.status(404).send({ message: 'No sigues ningun usuario' });

        return res.status(200)
            .send({ follows });
    });
}




module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows

}