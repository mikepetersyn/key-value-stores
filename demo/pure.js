const express = require('express');
const app = express();
const axios = require('axios');

const RedisClustr = require('redis');
const redisClient = RedisClustr.createClient();

const default_expiration = 120;

app.use(express.static('public'));

redisClient.on('connect', () => {
    console.error('connected to redis-server');
});

app.get('/photos/:albumId', async (req, res) => {
    const albumId = req.params.albumId;
    const s = Date.now();

        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/photos/${albumId}`);

        const d2 = Date.now() - s;
        console.log(`cached: false | time for single image: ${d2} ms`);
        return res.json({ time: d2, photo: data });
});

app.listen(3000, () => {
    console.log('REDIS DEMO with caching');
    console.log('reachable via http://localhost:3000');
});