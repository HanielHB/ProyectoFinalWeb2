const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/incidente.controller.js");

    // Rutas para Incidente
    router.get('/', verifyToken, controller.listIncidentes);             // Cualquier usuario autenticado
    router.get('/:id', verifyToken, controller.getIncidenteById);        // Cualquier usuario autenticado
    router.post('/', [verifyToken, isVerificador], controller.createIncidente); // Verificador o Admin
    router.put('/:id', [verifyToken, isVerificador], controller.updateIncidente); // Verificador o Admin
    router.delete('/:id', [verifyToken, isAdmin], controller.deleteIncidente);   // Solo Admin

    router.post('/:id/upload', [verifyToken, isVerificador], controller.uploadPicture);


    // Registrar el router con el prefijo /incidentes
    app.use('/incidentes', router);
};
