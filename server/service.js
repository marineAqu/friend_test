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

function generateUniqueUserId(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let userId = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        userId += characters.charAt(randomIndex);
    }

    return userId;
}

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

function getQuizId(answerNo) {
    return new Promise((resolve, reject) => {
        connect.query('SELECT quiz_id FROM quiz_answer WHERE no = ?',
            [answerNo],
            function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    console.log("첫번째 쿼리 결과: " + result[0]['quiz_id']);
                    resolve(result[0]['quiz_id']);
                }
        });
    });
}

function getScore(answerNo) {
    return new Promise((resolve, reject) => {
        connect.query('SELECT score FROM quiz_answer WHERE no = ?',
            [answerNo],
            function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0]['score']);
                    console.log("score: "+result[0]['score']);
                }
        });
    });
}

function getQuizDetailList(quizCode) {
    return new Promise((resolve, reject) => {
        connect.query('SELECT * FROM quiz_detail WHERE user_no = ? ORDER BY question_no',
            [quizCode],
            function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    console.log("getQuizDetailList: " + JSON.stringify(result));
                    resolve(result);
                }
        });
    });
}

function insertQuizList(name, uniqueId) {
    return new Promise((resolve, reject) => {
        connect.query('INSERT INTO quiz_list (quiz_name, quiz_id) values (?, ?)',
            [name, uniqueId],
            function (error, result) {
                if(error){
                    reject(error);
                }
                else{
                    console.log("insertQuizList resolve");
                    resolve();
                }
            });
    });
}

function getAnswerNameAndScore(quizId) {
    return new Promise((resolve, reject) => {
        connect.query('SELECT answer_name AS name, score, no FROM quiz_answer WHERE quiz_id = ?',
            [quizId],
            function (error, result) {
                if(error){
                    reject(error);
                }
                else{
                    resolve(result);
                }
            });
    });
}

function getnoFromQuizAnswer(quizId, answerName) {
    return new Promise((resolve, reject) => {
        connect.query('SELECT no FROM quiz_answer WHERE quiz_id = ? and answer_name = ?',
            [quizId, answerName],
            function (error, result) {
                if(error){
                    reject(error);
                }
                else{
                    resolve(result[0]['no']);
                    console.log("answerNo: "+result[0]['no']);
                }
            })
    });
}

function insertQuizAnswer(quizId, answerName, answerList, score){
    return new Promise((resolve, reject) => {
        connect.query('INSERT INTO quiz_answer(quiz_id, answer_name, answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10, score) values (?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?)',
            [quizId, answerName, answerList[0], answerList[1], answerList[2], answerList[3], answerList[4], answerList[5], answerList[6], answerList[7], answerList[8], answerList[9], score],
            function (error, result) {
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                }
            });
    });
}

function getAnswerList(answerNo){
    return new Promise((resolve, reject) => {
        connect.query('SELECT answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10 FROM quiz_answer WHERE no = ?',
            [answerNo],
            function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    console.log("세번째 쿼리 결과: " + JSON.stringify(result));
                    resolve(result[0]);
                }
        });
    });
}

function countScore(quizId){
    return new Promise((resolve, reject) => {
        let count = 0;

        connect.query('SELECT correct_no FROM quiz_detail WHERE user_no = ? ORDER BY question_no',
            [quizId],
            function (error, result) {
                if(error){
                    reject(error);
                }
                else{
                    for(let i=0; i<10; i++){
                        if(result[i]['correct_no'] === req.body.answerList[i]) count++;
                    }

                    console.log("count: "+count);
                    resolve(count);
                }
            });
    });
}

async function isUniqueId() {
    let uniqueId;

    while (true) {
        uniqueId = generateUniqueUserId();
        console.log(uniqueId);

        const result = await new Promise((resolve, reject) => {
            connect.query('SELECT EXISTS(SELECT 1 FROM quiz_list WHERE quiz_id = ?) as exist', [uniqueId], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0]['exist']);
                }
            });
        });

        if (result === 0) {
            break;
        }
    }

    return uniqueId;
}

function insertQuizDetail(uniqueId, quizList, image1, image2, image3, image4, image5) {
    return new Promise((resolve, reject) => {
        connect.query(
            'INSERT INTO quiz_detail (user_no, question_detail, question_no, correct_no, answer1, answer2, answer3, answer4, answer5, image1, image2, image3, image4, image5) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [uniqueId, quizList.questionDetail, quizList.questionNo, quizList.correctNo, quizList.answers[0], quizList.answers[1], quizList.answers[2], quizList.answers[3], quizList.answers[4], image1, image2, image3, image4, image5],
            function (error, result) {
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                    console.log("insertQuizDetail resolve");
                }
            }
        );
    });
}

module.exports = {
    getQuizName,
    getQuizId,
    getScore,
    getQuizDetailList,
    insertQuizList,
    getAnswerNameAndScore,
    getnoFromQuizAnswer,
    insertQuizAnswer,
    getAnswerList,
    countScore,
    isUniqueId,
    insertQuizDetail
};
