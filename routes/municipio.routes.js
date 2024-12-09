const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/municipio.controller.js");

    
    router.get('/', [verifyToken, isVerificador], controller.listMunicipios);             
    router.get('/:id', [verifyToken, isVerificador], controller.getMunicipioById);        
    router.post('/', [verifyToken, isVerificador], controller.createMunicipio); 
    router.put('/:id', [verifyToken, isVerificador], controller.updateMunicipio); 
    router.delete('/:id', [verifyToken, isAdmin], controller.deleteMunicipio);   

    // Registrar el router con el prefijo /municipios
    app.use('/municipios', router);
};
