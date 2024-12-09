const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.usuario = require('./usuario.model.js')(sequelize, Sequelize);
db.carretera = require('./carretera.model.js')(sequelize, Sequelize);
db.municipio = require('./municipio.model.js')(sequelize, Sequelize);
db.incidente = require('./incidente.model.js')(sequelize, Sequelize);
db.solicitudIncidencia = require('./solicitudIncidencia.model.js')(sequelize, Sequelize);

// Relaciones

// Relación 1:N - Carretera tiene origen y destino en Municipios
db.carretera.belongsTo(db.municipio, {
    foreignKey: "municipioOrigenId",
    as: "municipioOrigen"
});
db.carretera.belongsTo(db.municipio, {
    foreignKey: "municipioDestinoId",
    as: "municipioDestino"
});
db.municipio.hasMany(db.carretera, {
    foreignKey: "municipioOrigenId",
    as: "carreterasComoOrigen"
});
db.municipio.hasMany(db.carretera, {
    foreignKey: "municipioDestinoId",
    as: "carreterasComoDestino"
});

// Relación 1:N - Incidentes están asociados a Carreteras
db.incidente.belongsTo(db.carretera, {
    foreignKey: "carreteraId",
    as: "carretera"
});
db.carretera.hasMany(db.incidente, {
    foreignKey: "carreteraId",
    as: "incidentes"
});

// Relación 1:N - Usuarios administran o verifican cambios en Carreteras, Municipios, e Incidentes (logs)
db.usuario.hasMany(db.carretera, {
    foreignKey: "modificadoPor",
    as: "carreterasModificadas"
});
db.carretera.belongsTo(db.usuario, {
    foreignKey: "modificadoPor",
    as: "modificadoPorUsuario"
});

db.usuario.hasMany(db.municipio, {
    foreignKey: "modificadoPor",
    as: "municipiosModificados"
});
db.municipio.belongsTo(db.usuario, {
    foreignKey: "modificadoPor",
    as: "modificadoPorUsuario"
});

db.usuario.hasMany(db.incidente, {
    foreignKey: "modificadoPor",
    as: "incidentesModificados"
});
db.incidente.belongsTo(db.usuario, {
    foreignKey: "modificadoPor",
    as: "modificadoPorUsuario"
});

// Relación 1:N - Solicitudes de Incidencia pueden ser procesadas en Incidentes
db.solicitudIncidencia.belongsTo(db.incidente, {
    foreignKey: "incidenteId",
    as: "incidente"
});
db.incidente.hasMany(db.solicitudIncidencia, {
    foreignKey: "incidenteId",
    as: "solicitudes"
});

module.exports = db;
