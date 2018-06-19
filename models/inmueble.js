var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var inmuebleSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesario'] },
    precio: { type: String, required: [true, 'La descripcion es necesario'] },
    operacion: { type: String, required: [true, 'La descripcion es necesario'] },
    estado: { type: String, required: [true, 'La descripcion es necesario'] },



    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'inmuebles' });



module.exports = mongoose.model('Inmueble', inmuebleSchema);