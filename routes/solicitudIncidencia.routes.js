const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/solicitudesIncidencia.controller.js");

    // Rutas para SolicitudIncidencia
    router.get("/", verifyToken, controller.listSolicitudesPendientes); // Listar solicitudes    
    router.get("/procesadas" , verifyToken, controller.listSolicitudes)           
    router.get('/:id', controller.getSolicitudById);             // Obtener una solicitud por ID
    router.post('/', controller.createSolicitud);                // Crear una nueva solicitud
    router.put('/:id', controller.updateSolicitud);              // Actualizar una solicitud
    router.delete('/:id', controller.deleteSolicitud);           // Eliminar una solicitud
    router.put("/:id/aprobar", [verifyToken, isVerificador], controller.aprobarSolicitud); // Aprobar solicitud
    router.put("/:id/rechazar", [verifyToken, isVerificador], controller.rechazarSolicitud); // Rechazar solicitud

    // Registrar el router con el prefijo /solicitudes-incidencia
    app.use('/solicitudes-incidencia', router);
};
