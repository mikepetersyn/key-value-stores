const axios = require('axios');
const RedisClustr = require('redis-clustr');
const redisClient = new RedisClustr({
    servers: [
        {
            host: '192.168.75.21',
            port: 7000,
        },
        {
            host: '192.168.75.22',
            port: 7001,
        },
        {
            host: '192.168.75.23',
            port: 7002,
        },
        {
            host: '192.168.75.24',
            port: 7000,
        },
        {
            host: '192.168.75.25',
            port: 7001,
        },
        {
            host: '192.168.75.26',
            port: 7002,
        },
    ],
});

const default_expiration = 120;

redisClient.on('connect', () => {
    console.error('connected to redis-server');
});

const buildPage = () => {
    const sAll = Date.now();
    const allPromises = [];

    for (let i = 1; i < 501; i++) {
        allPromises.push(
            new Promise((resolve, reject) => {
                const s = Date.now();
                redisClient.get(`albumId?${i}`, async (error, photos) => {
                    if (error) console.log(error);
                    if (photos) {
                        console.log(`time for single image: ${Date.now() - s} ms | cached: true`);
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

                    console.log(`time for single image: ${Date.now() - s} ms | cached: false`);
                    return resolve();
                });
            })
        );
    }

    Promise.all(allPromises).then((durations) => {
        console.log(`total time for all images: ${Date.now() - sAll} ms`);
        process.exit();
    });
};

buildPage();
