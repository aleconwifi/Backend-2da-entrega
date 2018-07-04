'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowSchema = Schema({
    followed: { type: Schema.ObjectId, ref: 'Usuario' },
    usuario: { type: Schema.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Follow', FollowSchema);