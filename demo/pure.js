const express = require('express');
const app = express();
const axios = require('axios');

app.get('/', (req, res ) => {
    res.json({msg: 'Hello from redis demo application'});
})

app.get('/photos', async (req, res) => {

    console.time('response duration')
    
    const {data} = await axios.get('https://jsonplaceholder.typicode.com/photos');

    console.log('\nNOT CACHED. Requesting data from API');
    console.timeEnd('response duration');
    res.json(data);
})

app.listen(3000, () => {
    console.log('PURE DEMO with NO caching');
    console.log('reachable via http://localhost:3000');
})