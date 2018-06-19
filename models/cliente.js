var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    inmueble: {
        type: Schema.Types.ObjectId,
        ref: 'Inmueble',
        required: [true, 'El id inmueble esun campo obligatorio ']
    }
});


module.exports = mongoose.model('Cliente', clienteSchema);