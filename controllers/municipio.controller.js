const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

exports.listMunicipios = async (req, res) => {
    try {
        const municipios = await db.municipio.findAll({
            include: [
                { model: db.carretera, as: 'carreterasComoOrigen', attributes: [] },
                { model: db.carretera, as: 'carreterasComoDestino', attributes: [] }
            ]
        });
        res.json(municipios);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.getMunicipioById = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await getMunicipioOr404(id, res);
        if (!municipio) return;

        res.json(municipio);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.createMunicipio = async (req, res) => {
    const requiredFields = ['nombre', 'latitud', 'longitud'];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const nuevoMunicipio = await db.municipio.create(req.body);
        res.status(201).json(nuevoMunicipio);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.updateMunicipio = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await getMunicipioOr404(id, res);
        if (!municipio) return;

        municipio.nombre = req.body.nombre || municipio.nombre;
        municipio.latitud = req.body.latitud || municipio.latitud;
        municipio.longitud = req.body.longitud || municipio.longitud;

        await municipio.save();
        res.json(municipio);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.deleteMunicipio = async (req, res) => {
    const id = req.params.id;
    try {
        const municipio = await getMunicipioOr404(id, res);
        if (!municipio) return;

        await municipio.destroy();
        res.json({ msg: 'Municipio eliminado correctamente' });
    } catch (error) {
        sendError500(res, error);
    }
};

async function getMunicipioOr404(id, res) {
    const municipio = await db.municipio.findByPk(id, {
        include: [
            { model: db.carretera, as: 'carreterasComoOrigen', attributes: [] },
            { model: db.carretera, as: 'carreterasComoDestino', attributes: [] }
        ]
    });
    if (!municipio) {
        res.status(404).json({ msg: 'Municipio no encontrado' });
        return null;
    }
    return municipio;
}
