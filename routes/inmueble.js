var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Inmueble = require('../models/inmueble');

// ==========================================
// Obtener todos los inmuebles
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Inmueble.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, inmuebles) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando inmueble',
                        errors: err
                    });
                }

                Inmueble.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        inmuebles: inmuebles,
                        total: conteo
                    });
                })

            });
});

// ==========================================
//  Obtener Inmueble por ID
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Inmueble.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, inmueble) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar inmueble',
                    errors: err
                });
            }

            if (!inmueble) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El inmueble con el id ' + id + 'no existe',
                    errors: { message: 'No existe un inmueble con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                inmueble: inmueble
            });
        })
})





// ==========================================
// Actualizar Inmueble
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Inmueble.findById(id, (err, inmueble) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar inmueble',
                errors: err
            });
        }

        if (!inmueble) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El inmueble con el id ' + id + ' no existe',
                errors: { message: 'No existe un inmueble con ese ID' }
            });
        }


        inmueble.nombre = body.nombre;
        inmueble.descripcion = body.descripcion;
        inmueble.precio = body.precio;
        inmueble.operacion = body.operacion;
        inmueble.estado = body.estado;




        inmueble.usuario = req.usuario._id;

        inmueble.save((err, inmuebleGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar inmueble',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                inmueble: inmuebleGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo inmueble
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var inmueble = new Inmueble({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precio: body.precio,
        operacion: body.operacion,
        estado: body.estado,




        usuario: req.usuario._id
    });

    inmueble.save((err, inmuebleGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear inmueble',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            inmueble: inmuebleGuardado
        });


    });

});


// ============================================
//   Borrar un inmueble por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Inmueble.findByIdAndRemove(id, (err, inmuebleBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar inmueble',
                errors: err
            });
        }

        if (!inmuebleBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un inmueble con ese id',
                errors: { message: 'No existe un inmueble con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            inmueble: inmuebleBorrado
        });

    });

});


module.exports = app;