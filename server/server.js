//server.js
const express = require('express');
const app = express();
const multer = require("multer");
const test = require('./Router/test');
const cors = require('cors');
app.use(cors());
require('dotenv').config();

//app.use('/uploads', static(path.join(__dirname, 'uploads')));


const mysql = require('mysql');
const {response} = require("express");
const {readFileSync} = require("fs");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'friend_test'
});

connection.connect();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 50,
        fileSize: 1024 * 1024 * 1024
    }
});

app.use('/api', test);


console.log("테스트: "+process.env.NEXT_PUBLIC_TEST);

const port = 3002; //node 서버가 사용할 포트 번호, 리액트의 포트번호(3000)와 충돌하지 않게 다른 번호로 할당
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function generateUniqueUserId(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let userId = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        userId += characters.charAt(randomIndex);
    }

    return userId;
}

function isUniqueId(){
    let uniqueId;
    uniqueId = generateUniqueUserId();
    console.log(uniqueId);
    //유일한 키가 될 때까지 무한 반복

    connection.query('SELECT EXISTS(SELECT 1 FROM quiz_list WHERE quiz_id = ?) as exist', [uniqueId],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                //유일한 키인 경우
                if(result[0]['exist'] === 0) {
                    //return uniqueId;
                }
                else uniqueId = 0;
                //console.log("else문 안: "+result[0]['exist']);
                //break;
            }
        })
    return uniqueId;
}

function saveQuizInfo(name, uniqueId){
    connection.query('INSERT INTO quiz_list (quiz_name, quiz_id) values (?, ?)',
        [name, uniqueId],
        function (error, result) {
            if(error){
                throw error;
            }
        })
}

function readImageFile(file){
    const bitmap = readFileSync(file);
    const buf = new Buffer.from(bitmap)
    return buf
}

//퀴즈 내용 저장
function saveQuizDetail(uniqueId, quizDetail){
    connection.query('INSERT INTO quiz_detail (user_no, question_detail, question_no, correct_no, answer1, answer2, answer3, answer4, answer5, image1, image2, image3, image4, image5) values (?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ? ,?)',
        [uniqueId, quizDetail.questionDetail, quizDetail.questionNo, quizDetail.correctNo, quizDetail.answers[0], quizDetail.answers[1], quizDetail.answers[2], quizDetail.answers[3], quizDetail.answers[4], arr[0], arr[1], arr[2], arr[3], arr[4]],
        function (error, result) {
            if(error){
                throw error;
            }
        })
}

app.get('scoreditail', async (req, res) => {

    let quizList = [];
    let answerList = [];
    //req.answerNo[0], req.answerNo[1], req.answerNo[2], req.answerNo[3], req.answerNo[4], req.answerNo[5], req.answerNo[6], req.answerNo[7], req.answerNo[8], req.answerNo[9]

    //quizList 반환
    connection.query('SELECT * FROM quiz_detail WHERE user_no = ?',
        [req.answerNo],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                quizList = result[0];
            }
        })

    //answerList 반환
    connection.query('SELECT answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10 FROM quiz_answer WHERE quiz_id = ? and answer_id = ?',
        [req.answerNo, req.답변자_코드],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                answerList = result[0];
            }
        })

    res.json({quizList, answerList});
    //quizList와 answerList를 res에 담아보내기
});

app.get('score', async (req, res) => {

    console.log(req.answerNo);

    let quizname = '';
    let score = 0;

    connection.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = ?',
        [req.answerNo],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                quizname = result[0]['quiz_name'];
            }
        })

    connection.query('SELECT score FROM quiz_answer WHERE quiz_id = ? and answer_id = ?',
        [req.answerNo, req.답변자_이름],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                score = result[0]['score'];
            }
        })

    res.json({quizname, score});

});

app.get('getquiz', async (req, res) => {
    let quizList = [];

    connection.query('SELECT * FROM quiz_detail WHERE user_no = ? ORDER BY question_no',
        [req.quizId],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                quizList = result;
            }
        })

    res.json({quizList});
});


function CountScore(quizId, answerList){
    let countScore = 0;

    cconnection.query('SELECT correct_no FROM quiz_detail WHERE user_no = ? ORDER BY question_no',
        [quizId],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                for(let i=0; i<10; i++){
                    if(result[i]['correct_no'] === answerList[i]) countScore++;
                }
            }
        })

    return countScore;
}

app.post('saveAnswer', async (req, res) => {
    let score = CountScore(req.quizId, req.answerList);

    connection.query('INSERT INTO quiz_answer (quiz_id, answer_name, answer_id, answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10, score) values (?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ? ,?)',
        [req.quizId, req.answerName, req.답변자아이디, req.answerList[0], req.answerList[1], req.answerList[2], req.answerList[3], req.answerList[4], req.answerList[5], req.answerList[6], req.answerList[7], req.answerList[8], req.answerList[9], score],
        function (error, result) {
            if(error){
                throw error;
            }
        })
});

app.get('sharepage', async (req, res) => {
    let nickname = '';

    connection.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = ?',
        [req.quizId],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                quizname = result[0]['quiz_name'];
            }
        })

    res.json({nickname});
});

app.get('maintest', async (req, res) => {
    let quizname = '';

    connection.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = ?',
        [req.quizId],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                quizname = result[0]['quiz_name'];
            }
        })

    res.json({quizname});
});

/*

app.post('scoreditail', async (req, res) => {
});

*/

app.post('/saveMadeQuiz', upload.array('images'),async (req, res) => {
    let uniqueId; //퀴즈 코드
    const name = req.body.name; //작성자 이름
    const quizList = JSON.parse(req.body.quizList);

    console.log("테스트용:"+ req.files[0]); //여긴 undefined

    // console check
    req.files.map((data) => {
        console.log(data);
    });

    res.status(200).send({
        message: "Ok",
        fileInfo: quizList[0].images
        //req.files
    })


    //유일한 코드가 나올 때까지 반복
    while (1) {
        uniqueId = await isUniqueId();

        if (uniqueId !== 0) {
            console.log("uniqueId가 유일: " + uniqueId);
            break;
        }
    }

    //유일한 코드라면 quiz_list 테이블에 저장
    await saveQuizInfo(name, uniqueId);

    //TODO 퀴즈 내용을 quiz_detail에 저장
    for(let key in quizList){
        //console.log(quizList[key]);
        //saveQuizDetail(uniqueId, quizList[key], req.images[key]);
        //await saveQuizDetail(uniqueId, quizList[key]);
    }
});