var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Cliente = require('../models/cliente');

// ==========================================
// Obtener todos los clientes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cliente.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('inmueble')
        .exec(
            (err, clientes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando cliente',
                        errors: err
                    });
                }

                Cliente.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        clientes: clientes,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener médico
// ==========================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Cliente.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('inmueble')
        .exec((err, cliente) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar cliente',
                    errors: err
                });
            }

            if (!cliente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El cliente con el id ' + id + ' no existe',
                    errors: { message: 'No existe un cliente con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                cliente: cliente
            });

        })


});

// ==========================================
// Actualizar Cliente
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Cliente.findById(id, (err, cliente) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }


        cliente.nombre = body.nombre;
        cliente.usuario = req.usuario._id;
        cliente.inmueble = body.inmueble;

        cliente.save((err, clienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                cliente: clienteGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo cliente
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var cliente = new Cliente({
        nombre: body.nombre,
        usuario: req.usuario._id,
        inmueble: body.inmueble
    });

    cliente.save((err, clienteGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            cliente: clienteGuardado
        });


    });

});


// ============================================
//   Borrar un cliente por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar cliente',
                errors: err
            });
        }

        if (!clienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un cliente con ese id',
                errors: { message: 'No existe un cliente con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            cliente: clienteBorrado
        });

    });

});


module.exports = app;