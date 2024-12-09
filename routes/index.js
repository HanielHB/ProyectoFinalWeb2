module.exports = app => {
    require('./usuario.routes')(app);
    require('./carretera.routes')(app);
    require('./municipio.routes')(app);
    require('./incidente.routes')(app);
    require('./solicitudIncidencia.routes')(app); // Registro de rutas para solicitudes
};
