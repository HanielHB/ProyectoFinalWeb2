module.exports = (sequelize, Sequelize) => {
    const Incidente = sequelize.define("incidente", {
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        tipo: {
            type: Sequelize.ENUM(
                "Transitable con desvíos y/o horarios de circulación",
                "No transitable por conflictos sociales",
                "Restricción vehicular",
                "No transitable tráfico cerrado",
                "Restricción vehicular, especial"
            ),
            allowNull: false
        },
        latitud: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        longitud: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'incidentes'
    });

    return Incidente;
};
