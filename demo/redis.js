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

app.get('/photos/:albumId', (req, res) => {
    const albumId = req.params.albumId;
    const s = Date.now();

    redisClient.get(`albumId?${albumId}`, async (error, photos) => {
        if (error) console.log(error);
        if (photos) {
            const d = Date.now() - s;
            console.log(`cached: true | time for single image: ${d} ms`);
            return res.json({ time: d, photo: JSON.parse(photos) });
        }

        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/photos/${albumId}`);

        // save response to redis
        redisClient.setex(`albumId?${albumId}`, default_expiration, JSON.stringify(data));

        setTimeout(() => {
            console.log(`albumId?${albumId} expired: REMOVED FROM redis-server`);
        }, default_expiration * 1000);

        const d2 = Date.now() - s;
        console.log(`cached: false | time for single image: ${d2} ms`);
        return res.json({ time: d2, photo: data });
    });
});

app.listen(3000, () => {
    console.log('REDIS DEMO with caching');
    console.log('reachable via http://localhost:3000');
});
