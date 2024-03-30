//server.js
const express = require('express');
const app = express();
let multer = require("multer");
const test = require('./Router/test');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
require('dotenv').config();

//app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: false }));

const mysql = require('mysql');
const {response, json} = require("express");
const {readFileSync} = require("fs");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'friend_test'
});

connection.connect();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    fileFilter: function (req, file, callback){
        var ext = path.extname(file.originalname);
        if(ext !== ".png" && ext !== "jpg" && ext !== ".jpeg"){
            return callback(new Error("PNG, JPG만 업로드하세요."));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024,
    },
});

var upload = multer({
    storage: storage
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

app.post('/scoredetail', async (req, res) => {

    try {
        console.log("answerNo test: " + req.body.answerNo);
        console.log("req.body 출력 결과: " + JSON.stringify(req.body)); // {} 라고 출력됨

        let quizCode = await new Promise((resolve, reject) => {
            connection.query('SELECT quiz_id FROM quiz_answer WHERE no = ?', [req.body.answerNo], function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    console.log("첫번째 쿼리 결과: " + result[0]['quiz_id']);
                    resolve(result[0]['quiz_id']);
                }
            });
        });

        //quizList 반환
        let quizList = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM quiz_detail WHERE user_no = ?', [quizCode], function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    console.log("두번째 쿼리 결과: " + JSON.stringify(result));
                    resolve(result);
                }
            });
        });

        //answerList 반환
        let answerList = await new Promise((resolve, reject) => {
            connection.query('SELECT answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10 FROM quiz_answer WHERE no = ?', [req.body.answerNo], function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    console.log("세번째 쿼리 결과: " + JSON.stringify(result));
                    resolve(result[0]);
                }
            });
        });

        console.log("마지막 res: " + JSON.stringify({ quizList, answerList }));
        res.json({ quizList, answerList });
    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }

});

app.post('/score', async (req, res) => {

    try {
        console.log("answerNo test: " + req.body.answerNo);

        let quizname = await new Promise((resolve, reject) => {
            connection.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = (SELECT quiz_id FROM quiz_answer WHERE no = ?)', [req.body.answerNo], function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0]['quiz_name']);
                    console.log("quizname: "+result[0]['quiz_name']);
                }
            });
        });

        let score = await new Promise((resolve, reject) => {
            connection.query('SELECT score FROM quiz_answer WHERE no = ?', [req.body.answerNo], function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0]['score']);
                    console.log("score: "+result[0]['score']);
                }
            });
        });

        res.json({ quizname, score });
        console.log("마지막 res: " + JSON.stringify({ quizname, score }));
    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }

});

app.post('/getquiz', async (req, res) => {

    try{
        console.log("req.body.quizId의 값: "+req.body.quizId);

        let quizList = await new Promise((resolve, reject) => {
            connection.query('SELECT * FROM quiz_detail WHERE user_no = ? ORDER BY question_no',
                [req.body.quizId],
                function (error, result) {
                    if(error){
                        reject(error);
                    }
                    else{
                        resolve(result);
                    }
                });
        });

        res.json({quizList});
        console.log("마지막 res: " + JSON.stringify({ quizList }));

    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }
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

app.post('/saveAnswer', async (req, res) => {
    let score = CountScore(req.quizId, req.answerList);
    let numNo = 0;

    connection.query('INSERT INTO quiz_answer (quiz_id, answer_name, answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10, score) values (?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ? ,?)',
        [req.quizId, req.answerName, req.answerList[0], req.answerList[1], req.answerList[2], req.answerList[3], req.answerList[4], req.answerList[5], req.answerList[6], req.answerList[7], req.answerList[8], req.answerList[9], score],
        function (error, result) {
            if(error){
                throw error;
            }
        })

    connection.query('SELECT * FROM quiz_answer WHERE quiz_id = ? and answer_name = ?',
        [req.quizId, req.answerName],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                numNo = result[0]['no'];
            }
        })

    res.json({numNo});
});

app.post('/sharepage', async (req, res) => {
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

app.post('/maintest', async (req, res) => {
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

app.post('/scoreboard', async (req, res) => {
    let answerList = [[]];

    connection.query('SELECT * FROM quiz_answer WHERE quiz_id = ?',
        [req.quizId],
        function (error, result) {
            if(error){
                throw error;
            }
            else{
                answerList = result;
            }
        })

    console.log(answerList);
    res.json({answerList});
});

app.post('/saveMadeQuiz',async (req, res) => {
    let uniqueId; //퀴즈 코드
    const name = req.body.name; //작성자 이름
    const quizList = JSON.parse(req.body.quizList);

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

app.post('/tempTest', upload.single('image'), function (req, res) {
    res.json({message: '이미지 업로드 성공'});
});