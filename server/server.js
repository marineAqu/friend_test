//server.js
const express = require('express');
const app = express();
const multer = require("multer");
const test = require('./Router/test');
const cors = require('cors');
app.use(cors());
require('dotenv').config();

const mysql = require('mysql');
const {response} = require("express");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'friend_test'
});

connection.connect();

const upload = multer();

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
    const bitmap = fs.readFileSync(file);
    const buf = new Buffer.from(bitmap)
    return buf
}

function saveQuizDetail(uniqueId, quizDetail){
    //const images = [];
    /*
    for (let key in files) {
        if(files[key] != null) images.push(files[key]);
        else images.push(null);
    }

     */
    //let imgData;

    //for(let key in quizDetail.images) imgData[key] = readImageFile(quizDetail.images.path)
    console.log("0번째 이미지 path: "+quizDetail.images[0].path);
    //TODO 이미지 저장 ( MulterError: Unexpected field )
    //image1, image2, image3, image4, image5
    //, ?, ?, ?, ? ,?
    //, images[0], images[1], images[2], images[3], images[4]
    //quizDetail.images[0].buffer, quizDetail.images[1].buffer, quizDetail.images[2].buffer, quizDetail.images[3].buffer, quizDetail.images[4].buffer
    connection.query('INSERT INTO quiz_detail (user_no, question_detail, question_no, correct_no, answer1, answer2, answer3, answer4, answer5) values (?, ?, ?, ?, ?, ?, ?, ? ,?)',
        [uniqueId, quizDetail.questionDetail, quizDetail.questionNo, quizDetail.correctNo, quizDetail.answers[0], quizDetail.answers[1], quizDetail.answers[2], quizDetail.answers[3], quizDetail.answers[4]],
        function (error, result) {
            if(error){
                throw error;
            }
        })
}

app.post('/saveMadeQuiz', upload.none(),async (req, res) => {
    let uniqueId; //퀴즈 코드
    const name = req.body.name; //작성자 이름
    const quizList = JSON.parse(req.body.quizList);

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
        await saveQuizDetail(uniqueId, quizList[key]);
    }
});