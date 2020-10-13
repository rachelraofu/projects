
const axios = require('axios');
var youtube = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
});

module.exports = youtube;
