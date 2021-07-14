const express = require('express');
const app = express();
const axios = require('axios');
const RedisClustr = require('redis-clustr');
const Redis = require('redis');

require('dotenv').config();

const servers = [];
for (let i = 1; i <= process.env.NODES; i++) {
    servers.push({
        host: process.env[`NODE${i}`],
        port: 7000,
    });
}

const redisClient = new RedisClustr({
    servers: servers,
    createClient: function (port, host) {
        console.log(`Connecting to ${host} on port ${port}`);
        return Redis.createClient(port, host);
    },
});

const default_expiration = 30;

redisClient.on('connect', () => {
    console.error('connected to redis-server');
});

redisClient.on('error', (channel, message) => {
    console.log(channel);
    console.log(message);
});

app.get('/', (req, res) => {
    res.json({ msg: 'Hello from redis demo application' });
});

app.get('/photos', (req, res) => {
    console.time('response duration');

    redisClient.get('photos', async (error, photos) => {
        if (error) console.log(error);
        if (photos) {
            console.log('\nCACHED. Found data on redis-server');
            console.timeEnd('response duration');
            return res.json(JSON.parse(photos));
        }

        const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos');

        // save response to redis
        redisClient.setex('photos', default_expiration, JSON.stringify(data));

        console.log('\nNOT CACHED. Requesting data from API');
        console.timeEnd('response duration');

        setTimeout(() => {
            console.log('\n"photos" expired: REMOVED FROM redis-server');
        }, default_expiration * 1000);

        res.json(data);
    });
});

app.listen(3000, () => {
    console.log('\nREDIS DEMO with caching');
    console.log('reachable via http://localhost:3000');
});
