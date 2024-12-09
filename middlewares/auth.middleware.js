const jwt = require("jsonwebtoken");

const SECRET_KEY = "mi_secreto_super_seguro"; // Usa una clave segura desde una variable de entorno

// Middleware para verificar el token
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log("Authorization Header:", token); // <-- Verifica el encabezado recibido

    if (!token) {
        return res.status(403).json({ msg: "No se proporcionó un token" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.user = decoded; // Adjuntar el payload del token al objeto req
        next();
    } catch (error) {
        console.error("Error verificando el token:", error.message); // <-- Agrega este log para más detalles
        return res.status(401).json({ msg: "Token inválido o expirado" });
    }
};


// Middleware para verificar si es admin
exports.isAdmin = (req, res, next) => {
    console.log("Usuario en req.user:", req.user); // <-- Verifica el contenido del usuario
    if (req.user.tipo !== "admin") {
        return res.status(403).json({ msg: "No tienes permisos de administrador" });
    }
    next();
};

exports.isVerificador = (req, res, next) => {
    console.log("Usuario en req.user:", req.user);
    if (req.user.tipo !== "verificador" && req.user.tipo !== "admin") {
        return res.status(403).json({ msg: "No tienes permisos de verificador" });
    }
    next();
};

