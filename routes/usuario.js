var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var middlewareAuth = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../models/usuario');

// ============================
// Obtiene todos los usuarios
// ============================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando usuario',
                        errors: err
                    });
                };

                res.status(200).json({
                    ok: true,
                    usuarios
                });

            });

});



// ============================
// Actualizar usuario
// ============================
app.put('/:id', middlewareAuth.verificarToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        };

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: `El usuario con el id ${id} no existe`,
                errors: { message: `No existe un usuario con id ${id}` }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: err
                });
            };

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
    
        });
    });
});


// ============================
// Crea un usuario nuevo
// ============================
app.post('/', middlewareAuth.verificarToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                errors: err
            });
        };

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });

});

// ============================
// Eliminar usuario
// ============================
app.delete('/:id', middlewareAuth.verificarToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                errors: err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                message: `No existe un usuario con id ${id}`,
                errors: { message: `No existe un usuario con id ${id}` }
            });
        };

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
            usuarioToken: req.usuario
        });

    });

});

module.exports = app;