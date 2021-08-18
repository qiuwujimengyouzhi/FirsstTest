const https = require('https')
const fs = require('fs')
const express = require('express')
const app = express()
const cheerio = require('cheerio')
const cors = require('cors')
const path = require('path')
const opn = require('opn')
const url = require('url')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, './static')))

app.use(cors())

let rawDate = '';
let shuju = [];

app.use(cookieParser())
app.use(session({
    secret: 'loginId',
    cookie: { maxAge: 6000 * 1000 },
    saveUninitialized: false,
    resave: false
}))
let userRouter = require('../router/userRouter')
let proRouter = require('../router/proRouter')
app.use('/user', userRouter)
app.use('/product', proRouter)


app.post('/craw', function(req, res) {

    console.log(req.body);
    let url = req.body.urls;
    console.log(url)
    https.get(url, (res) => {
        rawDate = ''
        res.on('data', (chunk) => {

            rawDate += chunk.toString('utf8')
        })
        res.on('end', (chunk) => {
            let $ = cheerio.load(rawDate)
            shuju.splice(0, shuju.length)
            $('li.market-list-item').each((index, el) => {

                let mm = $(el)
                let food_time = mm.find('span.time').text()
                let food_product = mm.find('span.product').text()
                let food_place = mm.find('span.place').text()
                let food_price = mm.find('span.price').text()
                let food_lifting = mm.find('span.lifting').text()
                shuju.push({
                    food_time: food_time,
                    food_product: food_product,
                    food_place: food_place,
                    food_price: food_price,
                    food_lifting: food_lifting
                })
            })
            console.log('数据传输完毕')
        })

    }).on('error', (err) => {
        console.log('错' + err)
    });
    console.log('ww' + shuju.length)
    res.send(shuju)
})

app.listen(3000, () => {
    console.log('server start');
})