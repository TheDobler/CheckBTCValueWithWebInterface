const rp = require('request-promise');
const express = require('express')
const app = express()
const port = 3000
let coins = null;
var count = 0;

const coinData = {
    price: [null],
    last_updated: [null],
    symbol: [null],
    name: [null]
}

const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
        'start': '1',
        'limit': '3',
        'convert': 'USD'
    },
    headers: {
        'X-CMC_PRO_API_KEY': '9e430b7f-10a9-4f39-98a1-1ebc59e7e8dd'
    },
    json: true,
    gzip: true
};


app.use(express.static('public'));
app.get('/', (req, res) => {
    //res.send();
    res.set('content-Type', 'text/html');
    res.sendFile('C:/projects/CheckBTCValueWithWebInterface/public/Index.html');
    //res.sendFile('/home/btc/apps/CheckBTCValueWithWebInterface/public/Index.html');
})

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
    sendApi((a) => {
        res.send(a);
    })
})

app.listen(port, () => {
    //console.log(`Example app listening at http://localhost:${port}`);
    console.log(`Listening at port: ${port}`);
})

function sendApi(callback) {
    rp(requestOptions).then(response => {
        count++;
        console.log(count);
        coins = response.data;

        for (let i = 0; i < coins.length; i++) {
            // if (coins[i]['symbol'] == 'BTC') {
            //     BTC = coins[i];
            // }

            coinData.name[i] = coins[i]['name'];
            coinData.price[i] = coins[i].quote.USD.price;
            coinData.symbol[i] = coins[i].symbol;
            coinData.last_updated[i] = coins[i].quote.USD.last_updated;
        }
        //coinData.last_updated = BTC.quote.USD.last_updated;
        // coinData.name = BTC.name;
        // coinData.price = BTC.quote.USD.price;
        // coinData.symbol = BTC.symbol;

        callback(coinData);

    }).catch((err) => {
        console.log('API call error:', err.message);
    });
}

