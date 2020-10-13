
const axios = require('axios');
var server = axios.create({
    baseURL: 'http://localhost:5000',
});

module.exports = server;
