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

const default_expiration = 120;

redisClient.on('connect', () => {
    console.error('connected to redis-server');
});

redisClient.on('error', (channel, message) => {
    console.log(channel);
    console.log(message);
});

const buildPage = () => {
    const sAll = Date.now();
    const allPromises = [];

    for (let i = 1; i < 301; i++) {
        allPromises.push(
            new Promise((resolve, reject) => {
                const s = Date.now();
                redisClient.get(`albumId?${i}`, async (error, photos) => {
                    if (error) console.log(error);
                    if (photos) {
                        console.log(`cached: true | time for single image: ${Date.now() - s} ms`);
                        return resolve();
                    }

                    const { data } = await axios.get(
                        `https://jsonplaceholder.typicode.com/photos/${i}`
                    );

                    // save response to redis
                    redisClient.setex(`albumId?${i}`, default_expiration, JSON.stringify(data));

                    setTimeout(() => {
                        console.log(`\n"albumId?${i}" expired: REMOVED from redis-server`);
                    }, default_expiration * 1000);

                    console.log(`cached: false | time for single image: ${Date.now() - s} ms`);
                    return resolve();
                });
            })
        );
    }

    Promise.all(allPromises).then(() => {
        console.log(`total time for all images: ${Date.now() - sAll} ms`);
        process.exit();
    });
};

console.log('\nrequesting images in 5 seconds');
setTimeout(() => {
    buildPage();
}, 5000);
