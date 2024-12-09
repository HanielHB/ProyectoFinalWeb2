const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

exports.listSolicitudes = async (req, res) => {
    try {
        const solicitudes = await db.solicitudIncidencia.findAll({
            include: [
                { model: db.incidente, as: 'incidente', attributes: [] }
            ]
        });
        res.json(solicitudes);
    } catch (error) {
        sendError500(res, error);
    }
};
exports.listSolicitudesPendientes = async (req, res) => {
    try {
        const solicitudes = await db.solicitudIncidencia.findAll({
            where: { estado: "pendiente" },
        });
        res.json(solicitudes);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.getSolicitudById = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) return;

        res.json(solicitud);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.createSolicitud = async (req, res) => {
    const requiredFields = ['descripcion', 'foto_url'];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const nuevaSolicitud = await db.solicitudIncidencia.create(req.body);
        res.status(201).json(nuevaSolicitud);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.updateSolicitud = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) return;

        solicitud.descripcion = req.body.descripcion || solicitud.descripcion;
        solicitud.foto_url = req.body.foto_url || solicitud.foto_url;
        solicitud.estado = req.body.estado || solicitud.estado;

        await solicitud.save();
        res.json(solicitud);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.deleteSolicitud = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) return;

        await solicitud.destroy();
        res.json({ msg: 'Solicitud de incidencia eliminada correctamente' });
    } catch (error) {
        sendError500(res, error);
    }
};

// Aprobar una solicitud
exports.aprobarSolicitud = async (req, res) => {
    const id = req.params.id;

    try {
        const solicitud = await db.solicitudIncidencia.findByPk(id); // Nombre del modelo corregido

        if (!solicitud) {
            return res.status(404).json({ msg: "Solicitud no encontrada" });
        }

        if (solicitud.estado !== "pendiente") {
            return res.status(400).json({ msg: "La solicitud ya fue procesada" });
        }

        // Crear incidente a partir de la solicitud
        const incidente = await db.incidente.create({
            descripcion: solicitud.descripcion,
            tipo: "Incidencia", // Cambia esto según tu lógica
            latitud: 0, // Datos de prueba; reemplázalos con datos reales
            longitud: 0,
        });

        // Actualizar estado de la solicitud
        solicitud.estado = "procesado";
        await solicitud.save();

        res.json({
            msg: "Solicitud aprobada y incidente creado",
            incidente,
        });
    } catch (error) {
        console.error("Error al aprobar la solicitud:", error);
        sendError500(res, error);
    }
};


// Rechazar una solicitud
exports.rechazarSolicitud = async (req, res) => {
    const id = req.params.id;

    try {
        const solicitud = await db.solicitudIncidencia.findByPk(id); // Nombre del modelo corregido

        if (!solicitud) {
            return res.status(404).json({ msg: "Solicitud no encontrada" });
        }

        if (solicitud.estado !== "pendiente") {
            return res.status(400).json({ msg: "La solicitud ya fue procesada" });
        }

        // Actualizar estado a "rechazado" (si necesitas un nuevo estado, agrégalo en el modelo)
        solicitud.estado = "procesado";
        await solicitud.save();

        res.json({ msg: "Solicitud rechazada" });
    } catch (error) {
        console.error("Error al rechazar la solicitud:", error);
        sendError500(res, error);
    }
};



async function getSolicitudOr404(id, res) {
    const solicitud = await db.solicitudIncidencia.findByPk(id, {
        include: [
            { model: db.incidente, as: 'incidente', attributes: [] }
        ]
    });
    if (!solicitud) {
        res.status(404).json({ msg: 'Solicitud de incidencia no encontrada' });
        return null;
    }
    return solicitud;
}
