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

const getPhoto = (id) => {
    return new Promise((resolve, reject) => {
        const albumId = id;
        const s = Date.now();

        redisClient.get(`albumId?${albumId}`, async (error, photos) => {
            if (error) console.log(error);
            if (photos) {
                // console.log('\nCACHED. Found data on redis-server');
                // console.timeEnd('response duration');
                const d = Date.now() - s;
                resolve({ time: d, photo: JSON.parse(photos) });
            }

            const { data } = await axios.get(
                `https://jsonplaceholder.typicode.com/photos/${albumId}`
            );

            // save response to redis
            redisClient.setex(`albumId?${albumId}`, default_expiration, JSON.stringify(data));

            // console.log('\nNOT CACHED. Requesting data from API');
            // console.timeEnd('response duration');

            setTimeout(() => {
                console.log(`\n"albumId?${albumId}" expired: REMOVED from redis-server`);
            }, default_expiration * 1000);

            const d2 = Date.now() - s;
            resolve({ time: d2, photo: data });
        });
    });
};

const buildPage = () => {
    const s = Date.now();
    const allPromises = [];
    for (let i = 1; i < 101; i++) {
        allPromises.push(
            new Promise((resolve, reject) => {
                getPhoto(i)
                    .then((data) => {
                        console.log(data);
                        console.log(`time for single image: ${data.time} ms`);
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
        );
    }

    Promise.all(allPromises).then((durations) => {
        console.log(`total time for all images: ${((Date.now() - s) / 1000).toFixed(2)} s`);
    });
};

buildPage();
