module.exports = (sequelize, Sequelize) => {
    const SolicitudIncidencia = sequelize.define("solicitud_incidencia", {
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        foto_url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        estado: {
            type: Sequelize.ENUM("pendiente", "procesado"),
            defaultValue: "pendiente"
        }
    }, {
        timestamps: true,
        tableName: 'solicitudes_incidencia'
    });

    return SolicitudIncidencia;
};
