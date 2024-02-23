//server.js
const express = require('express');
const app = express();
const test = require('./Router/test');

app.use('/api', test);

const port = 3002; //node 서버가 사용할 포트 번호, 리액트의 포트번호(3000)와 충돌하지 않게 다른 번호로 할당
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

/*
기본 getMapping 문법

app.get('/home', function(요청, 응답){
    응답.send('내용');
});
*/

app.get('/', function (req, res) {
    res.send('홈');
    //res.sendFile(__dirname + 'main.html');

    const mysql = require('mysql');
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'friend_test'
    });

    connection.connect();

    connection.query('SELECT * from quiz_list', (error, rows, fields) => {
        if (error) throw error;
        console.log('quiz_list info is: ', rows);
    });

    connection.end();

});