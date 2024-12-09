const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

const express = require("express");
const path = require("path");
const fs = require('fs');
const app = express();
app.use("/public", express.static("public"));

exports.listIncidentes = async (req, res) => {
    try {
        const incidentes = await db.incidente.findAll({
            include: [
                { model: db.carretera, as: 'carretera', attributes: ['nombre'] }
            ]
        });
        res.json(incidentes);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.getIncidenteById = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getIncidenteOr404(id, res);
        if (!incidente) return;

        res.json(incidente);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.createIncidente = async (req, res) => {
    const requiredFields = ['descripcion', 'tipo', 'latitud', 'longitud', 'carreteraId'];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const nuevoIncidente = await db.incidente.create(req.body);
        res.status(201).json(nuevoIncidente);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.updateIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getIncidenteOr404(id, res);
        if (!incidente) return;

        incidente.descripcion = req.body.descripcion || incidente.descripcion;
        incidente.tipo = req.body.tipo || incidente.tipo;
        incidente.latitud = req.body.latitud || incidente.latitud;
        incidente.longitud = req.body.longitud || incidente.longitud;
        incidente.carreteraId = req.body.carreteraId || incidente.carreteraId;

        await incidente.save();
        res.json(incidente);
    } catch (error) {
        sendError500(res, error);
    }
};

exports.deleteIncidente = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getIncidenteOr404(id, res);
        if (!incidente) return;

        await incidente.destroy();
        res.json({ msg: 'Incidente eliminado correctamente' });
    } catch (error) {
        sendError500(res, error);
    }
};


exports.uploadPicture = async (req, res) => {
    const id = req.params.id;
    try {
        const incidente = await getPokemonOr404(id, res);
        if (!incidente) {
            return;
        }
        if (!req.files) {
            res.status(400).json({
                msg: 'No se ha enviado el archivo'
            });
            return;
        }
        const file = req.files.fotoPerfil;
        const fileName = incidente.id + '.jpg';
        file.mv(`public/incidente/${fileName}`);
        await incidente.save();
        res.json(incidente);
    } catch (error) {
        sendError500(error);
    }
}





async function getIncidenteOr404(id, res) {
    const incidente = await db.incidente.findByPk(id, {
        include: [
            { model: db.carretera, as: 'carretera', attributes: [] }
        ]
    });
    if (!incidente) {
        res.status(404).json({ msg: 'Incidente no encontrado' });
        return null;
    }
    return incidente;
}
