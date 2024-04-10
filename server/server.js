//server.js
const AWS = require('aws-sdk');
const path = require('path');
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const multerS3 = require('multer-s3');
const express = require('express');
const app = express();
let multer = require("multer");
const test = require('./Router/test');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
//const sql = require('./sql.js');
require('dotenv').config();

//app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: false }));

const mysql = require('mysql');
const {response, json} = require("express");
const {readFileSync} = require("fs");
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
connection.connect();

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new AWS.S3();

/*
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C://FTuploads');
        //cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        //cb(null, file.fieldname + '_' + req.body.name);
        //cb(null, file.originalname);
        cb(null, file.fieldname+' '+req.body.name+' '+file.originalname);
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
 */

const allowedExtensions =['.png', '.jpg', '.jpeg', '.bmp'];

const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    key: (req, file, callback) => {
        const uploadDirectory = req.query.directory ?? ''
        //const extension = path.extname(file.orginalname)
        //if(!allowedExtensions.includes(extension)) {
        //    return callback(new Error('wrong extension'))
        //}
        callback(null, `${uploadDirectory}/${Date.now()}_${file.orginalname}`)
    },
    acl: 'public-read-write'
});

const upload = multer({
    storage: storage
});

app.use('/api', test);

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
        console.log("score api req.body.answerNo:"+req.body.answerNo);

        let quizId = await new Promise((resolve, reject) => {
            connection.query('SELECT quiz_id FROM quiz_answer WHERE no = ?', [req.body.answerNo], function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0]['quiz_id']);
                    console.log("quizname: "+result[0]['quiz_id']);
                }
            });
        });

        let quizname = await new Promise((resolve, reject) => {
            connection.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = ?', [quizId], function (error, result) {
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

        res.json({ quizname, score, quizId });
        console.log("마지막 res: " + JSON.stringify({ quizname, score, quizId }));
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


app.post('/saveAnswer', async (req, res) => {
    try{
        console.log("req.body.answerList: "+req.body.answerList);

        let score = await new Promise((resolve, reject) => {
            let count = 0;

            connection.query('SELECT correct_no FROM quiz_detail WHERE user_no = ? ORDER BY question_no',
                [req.body.quizId],
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

        await new Promise((resolve, reject) => {
            connection.query('INSERT INTO quiz_answer(quiz_id, answer_name, answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10, score) values (?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?)',
                [req.body.quizId, req.body.answerName, req.body.answerList[0], req.body.answerList[1], req.body.answerList[2], req.body.answerList[3], req.body.answerList[4], req.body.answerList[5], req.body.answerList[6], req.body.answerList[7], req.body.answerList[8], req.body.answerList[9], score],
                function (error, result) {
                    if(error){
                        reject(error);
                    }
                    else{
                        resolve();
                    }
                });
        });

        let answerNo = await new Promise((resolve, reject) => {
            connection.query('SELECT no FROM quiz_answer WHERE quiz_id = ? and answer_name = ?',
                [req.body.quizId, req.body.answerName],
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

        res.json({answerNo});
        console.log("saveanswer res: "+ JSON.stringify({ answerNo }));

    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }
});

app.post('/sharepage', async (req, res) => {

    try{
        console.log("req출력: "+req.body.quizId);

        let nickname = await new Promise((resolve, reject) => {
            connection.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = ?',
                [req.body.quizId],
                function (error, result) {
                    if(error) {
                        reject(error);
                    }
                    else{
                        resolve(result[0]['quiz_name']);
                    }
                })

        });

        res.json({nickname});
        console.log("마지막 res: " + JSON.stringify({ nickname }));

    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }
});

app.post('/maintest', async (req, res) => {

    try{
        //let quizname = await sql.findQuizNameByQuizId(req.body.quizId);

        let quizname = await new Promise((resolve, reject) => {
            connection.query('SELECT quiz_name FROM quiz_list WHERE quiz_id = ?',
                [req.body.quizId],
                function (error, result) {
                    if(error){
                        reject(error);
                    }
                    else{
                        resolve(result[0]['quiz_name']);
                    }
                })
        });

        res.json({quizname});
        console.log("마지막 res: " + JSON.stringify({ quizname }));

    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }
});

app.post('/scoreboard', async (req, res) => {
    try{
        let rows = await new Promise((resolve, reject) => {
            connection.query('SELECT answer_name AS name, score, no FROM quiz_answer WHERE quiz_id = ?',
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

        res.json({rows});
        console.log(" scoreboard 마지막 res: " + JSON.stringify({ rows }));

    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }
});

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

app.post('/saveMadeQuiz', upload.fields([
    { name: 'image_0_0', maxCount: 1 },{ name: 'image_0_1', maxCount: 1 },{ name: 'image_0_2', maxCount: 1 },{ name: 'image_0_3', maxCount: 1 },{ name: 'image_0_4', maxCount: 1 },
    { name: 'image_1_0', maxCount: 1 },{ name: 'image_1_1', maxCount: 1 },{ name: 'image_1_2', maxCount: 1 },{ name: 'image_1_3', maxCount: 1 },{ name: 'image_1_4', maxCount: 1 },
    { name: 'image_2_0', maxCount: 1 },{ name: 'image_2_1', maxCount: 1 },{ name: 'image_2_2', maxCount: 1 },{ name: 'image_2_3', maxCount: 1 },{ name: 'image_2_4', maxCount: 1 },
    { name: 'image_3_0', maxCount: 1 },{ name: 'image_3_1', maxCount: 1 },{ name: 'image_3_2', maxCount: 1 },{ name: 'image_3_3', maxCount: 1 },{ name: 'image_3_4', maxCount: 1 },
    { name: 'image_4_0', maxCount: 1 },{ name: 'image_4_1', maxCount: 1 },{ name: 'image_4_2', maxCount: 1 },{ name: 'image_4_3', maxCount: 1 },{ name: 'image_4_4', maxCount: 1 },
    { name: 'image_5_0', maxCount: 1 },{ name: 'image_5_1', maxCount: 1 },{ name: 'image_5_2', maxCount: 1 },{ name: 'image_5_3', maxCount: 1 },{ name: 'image_5_4', maxCount: 1 },
    { name: 'image_6_0', maxCount: 1 },{ name: 'image_6_1', maxCount: 1 },{ name: 'image_6_2', maxCount: 1 },{ name: 'image_6_3', maxCount: 1 },{ name: 'image_6_4', maxCount: 1 },
    { name: 'image_7_0', maxCount: 1 },{ name: 'image_7_1', maxCount: 1 },{ name: 'image_7_2', maxCount: 1 },{ name: 'image_7_3', maxCount: 1 },{ name: 'image_7_4', maxCount: 1 },
    { name: 'image_8_0', maxCount: 1 },{ name: 'image_8_1', maxCount: 1 },{ name: 'image_8_2', maxCount: 1 },{ name: 'image_8_3', maxCount: 1 },{ name: 'image_8_4', maxCount: 1 },
    { name: 'image_9_0', maxCount: 1 },{ name: 'image_9_1', maxCount: 1 },{ name: 'image_9_2', maxCount: 1 },{ name: 'image_9_3', maxCount: 1 },{ name: 'image_9_4', maxCount: 1 }
]), async (req, res) => {
    try {
        let uniqueId; //퀴즈 코드
        const name = req.body.name; //작성자 이름
        const quizList = JSON.parse(req.body.quizList);

        // Generate unique ID
        while (1) {
            uniqueId = await isUniqueId();
            if (uniqueId !== 0) {
                console.log("uniqueId가 유일: " + uniqueId);
                break;
            }
        }

        // quizList테이블에 insert
        await saveQuizInfo(name, uniqueId);

        // Insert quiz details
        await asyncForEach(Object.keys(quizList), async (key) => {
            //TODO: 이미지가 없을 경우 null 처리
            const imageFiles = req.files;
            const image1 = imageFiles && imageFiles[`image_${key}_0`] ? imageFiles[`image_${key}_0`][0].filename : null;
            const image2 = imageFiles && imageFiles[`image_${key}_1`] ? imageFiles[`image_${key}_1`][0].filename : null;
            const image3 = imageFiles && imageFiles[`image_${key}_2`] ? imageFiles[`image_${key}_2`][0].filename : null;
            const image4 = imageFiles && imageFiles[`image_${key}_3`] ? imageFiles[`image_${key}_3`][0].filename : null;
            const image5 = imageFiles && imageFiles[`image_${key}_4`] ? imageFiles[`image_${key}_4`][0].filename : null;

            await connection.query(
                'INSERT INTO quiz_detail (user_no, question_detail, question_no, correct_no, answer1, answer2, answer3, answer4, answer5, image1, image2, image3, image4, image5) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [uniqueId, quizList[key].questionDetail, quizList[key].questionNo, quizList[key].correctNo, quizList[key].answers[0], quizList[key].answers[1], quizList[key].answers[2], quizList[key].answers[3], quizList[key].answers[4], image1, image2, image3, image4, image5]
            );
        });

        // 모든 데이터베이스 작업이 완료된 후
        res.json({ quizId: uniqueId });
        console.log(uniqueId);

    } catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).send("Internal Server Error");
    }
});

/*
app.post('/saveMadeQuiz',upload.fields([{ name: 'image_0_0', maxCount: 1 },{ name: 'image_0_1', maxCount: 1 },{ name: 'image_0_2', maxCount: 1 },{ name: 'image_0_3', maxCount: 1 },{ name: 'image_0_4', maxCount: 1 },
    { name: 'image_1_0', maxCount: 1 },{ name: 'image_1_1', maxCount: 1 },{ name: 'image_1_2', maxCount: 1 },{ name: 'image_1_3', maxCount: 1 },{ name: 'image_1_4', maxCount: 1 },
    { name: 'image_2_0', maxCount: 1 },{ name: 'image_2_1', maxCount: 1 },{ name: 'image_2_2', maxCount: 1 },{ name: 'image_2_3', maxCount: 1 },{ name: 'image_2_4', maxCount: 1 },
    { name: 'image_3_0', maxCount: 1 },{ name: 'image_3_1', maxCount: 1 },{ name: 'image_3_2', maxCount: 1 },{ name: 'image_3_3', maxCount: 1 },{ name: 'image_3_4', maxCount: 1 },
    { name: 'image_4_0', maxCount: 1 },{ name: 'image_4_1', maxCount: 1 },{ name: 'image_4_2', maxCount: 1 },{ name: 'image_4_3', maxCount: 1 },{ name: 'image_4_4', maxCount: 1 },
    { name: 'image_5_0', maxCount: 1 },{ name: 'image_5_1', maxCount: 1 },{ name: 'image_5_2', maxCount: 1 },{ name: 'image_5_3', maxCount: 1 },{ name: 'image_5_4', maxCount: 1 },
    { name: 'image_6_0', maxCount: 1 },{ name: 'image_6_1', maxCount: 1 },{ name: 'image_6_2', maxCount: 1 },{ name: 'image_6_3', maxCount: 1 },{ name: 'image_6_4', maxCount: 1 },
    { name: 'image_7_0', maxCount: 1 },{ name: 'image_7_1', maxCount: 1 },{ name: 'image_7_2', maxCount: 1 },{ name: 'image_7_3', maxCount: 1 },{ name: 'image_7_4', maxCount: 1 },
    { name: 'image_8_0', maxCount: 1 },{ name: 'image_8_1', maxCount: 1 },{ name: 'image_8_2', maxCount: 1 },{ name: 'image_8_3', maxCount: 1 },{ name: 'image_8_4', maxCount: 1 },
    { name: 'image_9_0', maxCount: 1 },{ name: 'image_9_1', maxCount: 1 },{ name: 'image_9_2', maxCount: 1 },{ name: 'image_9_3', maxCount: 1 },{ name: 'image_9_4', maxCount: 1 }]),async (req, res) => {

    let uniqueId; //퀴즈 코드
    const name = req.body.name; //작성자 이름
    const quizList = JSON.parse(req.body.quizList);

    //console.log("파일명 전달되는지: "+req.files.filename);


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

    for(let key in quizList){
        connection.query('INSERT INTO quiz_detail (user_no, question_detail, question_no, correct_no, answer1, answer2, answer3, answer4, answer5, image1, image2, image3, image4, image5) values (?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ? ,?)',
            [uniqueId, quizList[key].questionDetail, quizList[key].questionNo, quizList[key].correctNo, quizList[key].answers[0], quizList[key].answers[1], quizList[key].answers[2], quizList[key].answers[3], quizList[key].answers[4], req.files['image_0_0'][0].filename, req.files['image_0_0'][0].filename, req.files['image_0_0'][0].filename, req.files['image_0_0'][0].filename, req.files['image_0_0'][0].filename],
            function (error, result) {
                if(error){
                    throw error;
                }
            })
    }
});*/

app.post('/tempTest', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), function (req, res) {
    res.json({message: '이미지 업로드 성공'});
});