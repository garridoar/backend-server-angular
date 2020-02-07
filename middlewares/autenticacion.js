var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


// ============================
// Verificar token
// ============================
exports.verificarToken = function(req, res, next) { // Funciona como middleware

    var token = req.query.token;

    jwt.verify( token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({ // Unauthorized
                ok: false,
                message: 'Token no válido',
                errors: err
            });
        };

        req.usuario = decoded.usuario;

        next(); // Se usa el next para que no quede trabado, ya que no devuelve nada. 
                // Esta función se ejecutará antes de todas las funciones que se encuentran debajo,
                // por lo que si el token es inválido no se podrá hacer un PUT, DELETE, etc. Solo un GET 

    });

};