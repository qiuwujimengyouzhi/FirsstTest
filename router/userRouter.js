const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const session = require('express-session')
const cookieParser = require('cookie-parser')

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    multipleStatements: true,
    database: 'nongmao'
});

connection.connect();

router.post('/login', (req, res) => {
    let userid = req.body.userid
    let pwd = req.body.pwd
    let type = req.body.type
    let sql = "SELECT username FROM user where userid='" + userid + "' and pwd='" + pwd + "' and type='" + type + "'"
    let sql2 = "select * from session"

    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {

            if (result != '') {
                let jilu = ''
                connection.query(sql2, function(err, ni) {
                    jilu = ni[0].session
                    console.log('login' + jilu)

                    console.log(jilu == 'hehe')
                    let data = result[0].username
                    if (jilu == 'hehe') {
                        req.session.user = data
                        console.log('user:' + data)
                        let sql3 = "update session set session='" + req.session.user + "',type='" + type + "',userid='" + userid + "',pwd='" + pwd + "'"
                        connection.query(sql3)
                        let sql4 = "select * from user where username='" + data + "'"
                        connection.query(sql4, function(err, result) {
                            // console.log('login' + result)
                            let sql5 = "update session set pic='" + result[0].pic + "'"
                            connection.query(sql5)
                            let sql6 = "select username from store where username='" + userid + "'"
                            connection.query(sql6, function(err, result) {
                                console.log('sql6:' + result)
                                if (result == '') {
                                    let sql6 = "insert into store (username) values('" + userid + "')"
                                    connection.query(sql6)
                                }
                            })

                            res.send({
                                'list': data,
                                'flag': true
                            })
                        })
                    } else {
                        res.send({
                            'flag': false
                        })
                    }
                })
            } else {
                res.send({
                    'list': '',
                    'flag': true
                })
            }
        }
    });
});

router.post('/res', (req, res) => {
    let userid = req.body.userid
    let pwd = req.body.pwd
    let type = req.body.type
    let username = req.body.username
    let flag = false
    let sql = "insert into user(userid,pwd,username,type) values('" + userid + "','" + pwd + "','" + username + "','" + type + "') "
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.send(flag)
            return;
        } else {
            // let sql2 = "select * from user where userid='" + userid + "'"
            // connection.query(sql2, function(err, result) {
            //     if (result == null) {
            flag = true
            res.send(flag)
        }
        //  else {
        //     res.send(flag)
        // }
    })
})

router.post('/logout', (req, res) => {
    let sql = "truncate table session"
    let sql2 = "insert into session(session,type) values('hehe',0)"
    let flag = true
    connection.query(sql, function(err) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            flag = false
            return;
        } else {
            connection.query(sql2)
            res.send(flag)
        }
    })
});

router.post('/username', (req, res) => {
    let sql = "select * from session"
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {
            // console.log(result)
            name = result[0].session
            who = result[0].type
            userid = result[0].userid
            pwd = result[0].pwd
            pic = result[0].pic
            if (name == 'hehe') {
                res.send({
                    'flag': false,
                    'name': name
                })
            } else {
                res.send({
                        'flag': true,
                        'name': name,
                        'who': who,
                        'userid': userid,
                        'pwd': pwd,
                        'pic': pic
                    })
                    // console.log('username' + pic)
            }

        }
    })
});

router.post('/changePwd', (req, res) => {
    let new1 = req.body.new1
    let userid = req.body.userid
    let flag = false
    let sql = "update user set pwd='" + new1 + "' where userid='" + userid + "'"
        // let sql2 = "truncate table session"
        // let sql3 = "insert into session(session,type) values('hehe',0)"
        // let sql2 = "select userid "
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            res.send(flag);
        } else {
            let sql2 = "truncate table session"
            connection.query(sql2)
            let sql3 = "insert into session(session,type) values('hehe',0)"
            connection.query(sql3)
            flag = true
            res.send(flag)
        }
    })
});

router.post('/touxiang', (req, res) => {
    let address = req.body.address
    let userid = req.body.userid
    let sql = "update user set pic='" + address + "' where userid='" + userid + "'"
    connection.query(sql)
    let sql2 = "update session set pic='" + address + "'"
    connection.query(sql2)
});

router.post('/isstore', (req, res) => {
    let userid = req.body.userid
    let flag = true
    let sql = "select storeName from store where username='" + userid + "'"
        // console.log(sql)
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        } else {
            console.log('storeName:' + result[0].storeName)
            if (result[0].storeName == null) {
                flag = false
                res.send(flag)
            } else {
                res.send(flag)
            }
        }
        // console.log(result == null)
    })
});

router.post('/store', (req, res) => {
    let username = req.body.username
    let storeName = req.body.storeName
    let storeIntro = req.body.storeIntro
    let pic = req.body.pic
    let flag = false
        // console.log(username)
    let sql = "update store set storeIntro='" + storeIntro + "',storeName='" + storeName + "', storeBg='" + pic + "' where username='" + username + "' "
        // let sql = "insert into store (storeIntro,storeName,storeBg) values(,,'" + pic + "')"
    connection.query(sql, function(err, result) {
        if (err) {
            res.send(flag)
        } else {
            flag = true
            res.send(flag)
        }
    })
});

//connection.end();
module.exports = router