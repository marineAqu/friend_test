// service.js
const mysql = require("mysql");
require('dotenv').config();
const connect = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connect.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        throw err;
    }
    console.log('MySQL 연결 성공');
});

function getQuizName(quizId) {
    return new Promise((resolve, reject) => {
        connect.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = ?',
            [quizId],
            function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0]['quiz_name']);
                }
            });
    });
}

function findQuizNameByQuizId(quizId) {
    connect.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = ?',
        [quizId],
        function (error, result) {
            if(error){
                return(error);
            }
            else{
                return(result[0]['quiz_name']);
            }
        })
}

module.exports = {
    getQuizName,
    findQuizNameByQuizId: findQuizNameByQuizId
};
