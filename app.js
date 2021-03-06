const express = require('express');
const helmet = require("helmet");

const bodyParser = require('body-parser');
require('dotenv').config()
const path = require('path')

const employesDB = require('./database/routesDB/employesDB')


const employesRoutes = require('./routes/employes');
const publicationRoutes = require('./routes/publication');
const commentaireRoutes = require('./routes/commentaire');

const app = express();
app.use(helmet());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/DB', employesDB);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/employes', employesRoutes);
app.use('/api/publication', publicationRoutes);
app.use('/api/commentaire', commentaireRoutes);


module.exports = app;