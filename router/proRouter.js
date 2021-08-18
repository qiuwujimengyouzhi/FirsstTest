const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const multer = require('multer')

let storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function(req, file, cb) {
        cb(null, './static/img') //文件路径
    },
    //给上传文件重命名，获取添加后缀名
    filename: function(req, file, cb) {
        // var fileFormat = file.originalnane.split('.')[1];
        //给图片加上时间戳格式防止重命名  fugai
        let ext = file.originalname.split('.')[1]
        let typename = (new Date()).getTime()
        cb(null, `${typename}.${ ext }`)
            // console.log(file)
            // cb(null, 'aaa.jpg')
    }
});
let upload = multer({
    storage: storage
});


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    multipleStatements: true,
    database: 'nongmao'
});

connection.connect();

router.post('/addPro', (req, res) => {
    let addre = req.body.addre
    let product = req.body.product
    let type = req.body.type
    let price = req.body.price
    let place = req.body.place
    let discount = req.body.discount
    let time = req.body.time
    let store = req.body.store
        // console.log(store)
    let sql = "insert into grocery(pictures,product,type,price,place,discount,time,store) "
    sql += "values('" + addre + "','" + product + "','" + type + "','" + price + "','" + place + "',"
    sql += "'" + discount + "','" + time + "','" + store + "') "
    connection.query(sql, function(err, result) {
        flag = true
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            flag = false
            return;
        } else {
            res.send(flag)
        }
    })
});

router.post('/priPro', (req, res) => {
    let userid = req.body.userid
    let sql = "select * from grocery where store='" + userid + "'"
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {
            // data = JSON.stringify(result)
            // let jsonLength = 0;
            // for (let item in result) {
            //     jsonLength++;
            // }
            // console.log(result)
            res.send(result)
                // console.log(data[0].time)    undefined
        }
    })
});

router.post('/priProC', (req, res) => {
    let sql = "select * from grocery"
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {
            // data = JSON.stringify(result)
            // let jsonLength = 0;
            // for (let item in result) {
            //     jsonLength++;
            // }
            // console.log(result)
            res.send(result)
                // console.log(data[0].time)    undefined
        }
    })
});

router.post('/delPro', (req, res) => {
    let flag = false
    let index = req.body.index
    let relIndex = index + 1
        // console.log(index)
        // console.log(relIndex)
    let sql = "delete  from grocery where list='" + relIndex + "'  "
        // let sqla='delete * from grocery where list="'+index+'"'
        // let sql = "select * from grocery"
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return flag;
        } else {
            flag = true
            return res.send(flag)
        }
    })
})

//图片数据的key
router.post('/img', upload.single('pro'), (req, res) => {
    // console.log(req.file)
    let imges = req.file
    let { size, mimetype, path } = imges
    let types = ['jpg', 'jpeg', 'png']
    let tmpType = mimetype.split('/')[1]
    console.log(imges)
    if (size > 500000) {
        return res.send({ err: -1, msg: '尺寸过大' })
    } else if (types.indexOf(tmpType) == -1) {
        return res.send({ err: -2, msg: '图片类型错误', type: tmpType })
    } else {
        let url = `/public/img/${req.file.filename}`
        return res.send({ err: 0, msg: 'OK', img: url })
    }
})

router.post('/userimg', upload.single('user'), (req, res) => {
    console.log(req.file)
    let imges = req.file
    let { size, mimetype, path } = imges
    let types = ['jpg', 'jpeg', 'png']
    let tmpType = mimetype.split('/')[1]
    if (size > 100000) {
        return res.send({ err: -1, msg: '尺寸过大' })
    } else if (types.indexOf(tmpType) == -1) {
        return res.send({ err: -2, msg: '图片类型错误' })
    } else {
        let url = `/public/img/${req.file.filename}`
        return res.send({ err: 0, msg: 'OK', img: url })
    }
});

router.post('/shop', (req, res) => {
    let userid = req.body.userid
    let sql = "select * from store where username='" + userid + "'"
    connection.query(sql, function(err, result) {
        console.log(sql)
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
        } else {
            res.send({
                'storeName': result[0].storeName,
                'storeIntro': result[0].storeIntro,
                'storeBg': result[0].storeBg,
                'dengji': result[0].dengji
            })
        }
    })
});

router.post('/findS', (req, res) => {
    let indexs = req.body.index
    let indexf = parseInt(indexs) + 2
    let sql = "select store from grocery where list=" + indexf + ""
    connection.query(sql, function(err, result) {
        // console.log(typeof(result[0].store))
        res.send(result[0].store)
    })
});

router.post('/pingfen', (req, res) => {
    let userid = req.body.userid
    let fen = req.body.fen
    let sql2 = "select renshu,fenshu from store where username='" + userid + "'"
    connection.query(sql2, function(err, result) {
        let count = result[0].renshu
        let fena = parseInt(result[0].fenshu) + parseInt(fen)
        let fenf = fena / count
        let fens = Math.round(fenf)
        let counts = count + 1
        console.log(fena, fenf, count, fens)
        let sql = "update store set dengji='" + fens + "' ,renshu='" + counts + "',fenshu='" + fena + "' where username='" + userid + "'"
        connection.query(sql, function(err, result) {
            res.send({
                'flag': true,
                'count': count
            })
        })

    })
});

module.exports = router