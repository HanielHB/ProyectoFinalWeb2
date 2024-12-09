module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tipo: {
            type: Sequelize.ENUM("admin", "verificador"),
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'usuarios'
    });

    return Usuario;
};
