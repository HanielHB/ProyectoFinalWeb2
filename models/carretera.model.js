module.exports = (sequelize, Sequelize) => {
    const Carretera = sequelize.define("carretera", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        municipioOrigenId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        municipioDestinoId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        estado: {
            type: Sequelize.ENUM("libre", "bloqueada"),
            defaultValue: "libre"
        },
        razon_bloqueo: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        recorrido: {
            type: Sequelize.TEXT, // Almacenaremos el recorrido como JSON serializado
            allowNull: false
        }
    });

    return Carretera;
};
