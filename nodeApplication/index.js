const express =  require('express');
const app = express();
const axios = require('axios');

app.get('/', (req, res ) => {
    res.json({msg: 'Hello from redis demo application'})
})

app.get('/get-pictures', async (req, res) => {

    console.time('response duration')
    const {data} = await axios.get('https://jsonplaceholder.typicode.com/photos');

    console.log('\nNOT CACHED. Requesting data from API');
    console.timeEnd('response duration');
    res.json(data);
})

app.listen(3000, () => {
    console.log('demo reachable via http://localhost:3000')
})