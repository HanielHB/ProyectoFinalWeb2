const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor

exports.listCarreteras = async (req, res) => {
    try {
        const carreteras = await db.carretera.findAll({
            include: [
                { model: db.municipio, as: 'municipioOrigen', attributes: ['nombre'] },
                { model: db.municipio, as: 'municipioDestino', attributes: ['nombre'] }
            ]
        });

        const result = carreteras.map(carretera => ({
            ...carretera.toJSON(),
            recorrido: carretera.recorrido ? JSON.parse(carretera.recorrido) : [] 
        }));

        res.json(result);
    } catch (error) {
        sendError500(res, error);
    }
};




exports.getCarreteraById = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await getCarreteraOr404(id, res);
        if (!carretera) return;

        res.json({
            ...carretera.toJSON(),
            recorrido: carretera.recorrido ? JSON.parse(carretera.recorrido) : [] // Validar JSON
        });
    } catch (error) {
        sendError500(res, error);
    }
};

exports.listCarreterasPublico = async (req, res) => {
    try {
        const carreteras = await db.carretera.findAll({
            attributes: ["id", "nombre", "estado", "recorrido"],
        });

        const result = carreteras.map((carretera) => ({
            ...carretera.toJSON(),
            recorrido: carretera.recorrido ? JSON.parse(carretera.recorrido) : [],
        }));

        res.json(result);
    } catch (error) {
        sendError500(res, error);
    }
};





exports.createCarretera = async (req, res) => {
    const { nombre, estado, razon_bloqueo, recorrido } = req.body;
    try {
        const nuevaCarretera = await db.carretera.create({
            nombre,
            estado,
            razon_bloqueo,
            recorrido: JSON.stringify(recorrido), // Guarda como JSON
        });
        res.status(201).json(nuevaCarretera);
    } catch (error) {
        sendError500(res, error);
    }
};



exports.updateCarretera = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await getCarreteraOr404(id, res);
        if (!carretera) return;

        carretera.nombre = req.body.nombre || carretera.nombre;
        carretera.estado = req.body.estado || carretera.estado;
        carretera.razon_bloqueo = req.body.razon_bloqueo || carretera.razon_bloqueo;
        carretera.recorrido = req.body.recorrido ? JSON.stringify(req.body.recorrido) : carretera.recorrido;

        await carretera.save();
        res.json(carretera);
    } catch (error) {
        sendError500(res, error);
    }
};



exports.deleteCarretera = async (req, res) => {
    const id = req.params.id;
    try {
        const carretera = await getCarreteraOr404(id, res);
        if (!carretera) return;

        await carretera.destroy();
        res.json({ msg: 'Carretera eliminada correctamente' });
    } catch (error) {
        sendError500(res, error);
    }
};

async function getCarreteraOr404(id, res) {
    const carretera = await db.carretera.findByPk(id, {
        include: [
            { model: db.municipio, as: 'municipioOrigen', attributes: ['nombre'] },
            { model: db.municipio, as: 'municipioDestino', attributes: ['nombre'] },
            { model: db.incidente, as: 'incidentes', attributes: [] }
        ]
    });
    if (!carretera) {
        res.status(404).json({ msg: 'Carretera no encontrada' });
        return null;
    }
    return carretera;
}

