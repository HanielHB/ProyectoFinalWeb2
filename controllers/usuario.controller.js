const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mi_secreto_super_seguro"; // Usa una clave más segura y configúrala como variable de entorno

exports.listUsuarios = async (req, res) => {
    try {
        const usuarios = await db.usuario.findAll({
            include: [
                { model: db.carretera, as: 'carreterasModificadas', attributes: [] },
                { model: db.municipio, as: 'municipiosModificados', attributes: [] },
                { model: db.incidente, as: 'incidentesModificados', attributes: [] }
            ]
        });
        res.json(usuarios);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) return;
        res.json(usuario);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.createUsuario = async (req, res) => {
    const requiredFields = ['email', 'password', 'tipo'];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        // Cifrar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const nuevoUsuario = await db.usuario.create({
            email: req.body.email,
            password: hashedPassword,
            tipo: req.body.tipo
        });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.updateUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) return;

        usuario.email = req.body.email || usuario.email;

        if (req.body.password) {
            usuario.password = await bcrypt.hash(req.body.password, 10);
        }

        usuario.tipo = req.body.tipo || usuario.tipo;

        await usuario.save();
        res.json(usuario);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.deleteUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) return;

        await usuario.destroy();
        res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (error) {
        sendError500(res, error);
    }
};

// Login de usuario
exports.login = async (req, res) => {
    const requiredFields = ['email', 'password'];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await db.usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        // Generar token JWT
        const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        sendError500(res, error);
    }
};

// Logout (no funcionalidad directa en JWT, pero se puede manejar en frontend)
exports.logout = (req, res) => {
    try {
        // En el frontend, eliminar el token del almacenamiento local/cookie.
        res.json({ msg: "Sesión cerrada exitosamente" });
    } catch (error) {
        sendError500(res, error);
    }
};

// Helper para obtener usuario o devolver 404
async function getUsuarioOr404(id, res) {
    const usuario = await db.usuario.findByPk(id, {
        include: [
            { model: db.carretera, as: 'carreterasModificadas', attributes: [] },
            { model: db.municipio, as: 'municipiosModificados', attributes: [] },
            { model: db.incidente, as: 'incidentesModificados', attributes: [] }
        ]
    });
    if (!usuario) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return null;
    }
    return usuario;
}


async function getUsuarioOr404(id, res) {
    const usuario = await db.usuario.findByPk(id, {
        include: [
            { model: db.carretera, as: 'carreterasModificadas', attributes: [] },
            { model: db.municipio, as: 'municipiosModificados', attributes: [] },
            { model: db.incidente, as: 'incidentesModificados', attributes: [] }
        ]
    });
    if (!usuario) {
        res.status(404).json({ msg: 'Usuario no encontrado' });
        return null;
    }
    return usuario;
}
