const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/carretera.controller.js");

    // Rutas para Carretera
    router.get('/', verifyToken, controller.listCarreteras);
    router.get('/public/carreteras',  controller.listCarreterasPublico);              
    router.get('/:id', verifyToken, controller.getCarreteraById);         
    router.post('/', [verifyToken, isVerificador], controller.createCarretera); 
    router.put('/:id', [verifyToken, isVerificador], controller.updateCarretera); 
    router.delete('/:id', [verifyToken, isAdmin], controller.deleteCarretera);   

    // Registrar el router con el prefijo /carreteras
    app.use('/carreteras', router);
};
