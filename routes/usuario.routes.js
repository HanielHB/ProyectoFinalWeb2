const { verifyToken, isAdmin, isVerificador } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/usuario.controller.js");

    
    router.get('/rol', verifyToken, (req, res) => {
        res.json({
            id: req.user.id,
            tipo: req.user.tipo
        });
    });
    
    router.get('/', [verifyToken, isAdmin],controller.listUsuarios);
    router.get('/:id', [verifyToken, isAdmin],controller.getUsuarioById);
    router.post('/', [verifyToken, isAdmin],controller.createUsuario);
    router.put('/:id', [verifyToken, isAdmin],controller.updateUsuario);
    router.delete('/:id', [verifyToken, isAdmin],controller.deleteUsuario);
    
    
    

    
    router.post('/login', controller.login);         
    router.post('/logout', controller.logout);       

    
    app.use('/usuarios', router);
};
