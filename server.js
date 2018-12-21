var express = require('express');
const pg = require('pg');
var Pool = require('pg-pool');
var bodyParser = require('body-parser');
var pool = new pg.Pool({
    database: 'skorohod',
    user: 'admin_mgtu',
    password: 'qweewq123',
    host: 'mgtu.cgigpik1cssh.us-east-2.rds.amazonaws.com',
    port: '5432'
});

var app = express();
var cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.listen(3100, function () {
    console.log('API app started');
});

app.post('/users', function (req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            return next(err)
        }
        client.query(
            'SELECT * FROM public.users WHERE login=$1 AND password=$2'
        , [req.body.login, req.body.password], function (err, result) {
                done()
                if(err){
                    return next(err)
                }
                if (result.rowCount !==0){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(401);
                }
            }
        )
    })
});
//добавить client.query

app.post('/users1', function (req,res,next) {
    pool.connect(function (err,client, done) {
        if(err) {
            return next(err)
        }
        client.query(// поменять в соответствии с нашей таблицей users
            'INSERT INTO users VALUES' +
            'users.id, ' +
            'users.login, ' +
            'users.password, '
            , [], function (err, relult) {
                done()
                if(err){
                    return next(err)
                }
                res.json(relult.rows)
            }
        )
    })

});


// Проверка на авторизацию пользователя в системе
app.post('/auth', function (req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            // Передача ошибки в обработчик express
            return next(err)
        }
        client.query('SELECT * FROM public.users  WHERE login=$1 AND password=$2;', [req.body.login, req.body.password], function (err, result) {
            done()
            if (err) {
                // Передача ошибки в обработчик express
                return next(err)
            }
            if (result.rowCount !== 0){
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        })
    })
});

