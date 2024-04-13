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
const service = require('./service.js');
require('dotenv').config();

app.use(express.urlencoded({ extended: false }));

const {response, json} = require("express");

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new AWS.S3();

const allowedExtensions =['.png', '.jpg', '.jpeg', '.bmp'];

const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    key: function (req, file, callback) {
        //const uploadDirectory = req.query.directory ?? ''
        const uploadDirectory = '';
        //const extension = path.extname(file.originalname)
        //if(!allowedExtensions.includes(extension)) {
        //    return callback(new Error('wrong extension'))
        //}
        callback(null, `${uploadDirectory}/${Date.now()}_${file.fieldname}_${file.originalname}`)
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

app.post('/scoredetail', async (req, res) => {

    try {
        const quizCode = await service.getQuizId(req.body.answerNo);
        //quizList 반환
        const quizList = await service.getQuizDetailList(quizCode);
        //answerList 반환
        const answerList = await service.getAnswerList(req.body.answerNo);

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

        const quizId = await service.getQuizId(req.body.answerNo);
        const quizname = await service.getQuizName(quizId);
        const score = await service.getScore(req.body.answerNo);

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

        const quizList = await service.getQuizDetailList(req.body.quizId);

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

        const score = await service.countScore(req.body.quizId);

        await service.insertQuizAnswer(req.body.quizId, req.body.answerName, req.body.answerList, score);

        const answerNo = await service.getnoFromQuizAnswer(req.body.quizId, req.body.answerName);

        res.json({answerNo});
        console.log("saveanswer res: "+ JSON.stringify({ answerNo }));

    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }
});

app.post('/sharepage', async (req, res) => {

    try{
        const nickname = await service.getQuizName(req.body.quizId);

        res.json({nickname});
        console.log("sharepage nickname: " + JSON.stringify({ nickname }));

    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }
});

app.post('/maintest', async (req, res) => {

    try{
        const quizname = await service.getQuizName(req.body.quizId);

        res.json({quizname});
        console.log("마지막 res: " + JSON.stringify({ quizname }));

    } catch (error) {
        console.error("에러 발생: " + error);
        res.status(500).json({ error: "서버 내부 오류 발생" });
    }
});

app.post('/scoreboard', async (req, res) => {
    try{
        const rows = await service.getAnswerNameAndScore(req.body.quizId);

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
        const uniqueId = await service.isUniqueId();; //퀴즈 코드
        const name = req.body.name; //작성자 이름
        const quizList = JSON.parse(req.body.quizList);

        // quizList테이블에 insert
        await service.insertQuizList(name, uniqueId);

        // Insert quiz details
        await asyncForEach(Object.keys(quizList), async (key) => {
            //TODO: 이미지가 없을 경우 null 처리
            const imageFiles = req.files;
            const image1 = imageFiles && imageFiles[`image_${key}_0`] ? imageFiles[`image_${key}_0`][0].location : null;
            const image2 = imageFiles && imageFiles[`image_${key}_1`] ? imageFiles[`image_${key}_1`][0].location : null;
            const image3 = imageFiles && imageFiles[`image_${key}_2`] ? imageFiles[`image_${key}_2`][0].location : null;
            const image4 = imageFiles && imageFiles[`image_${key}_3`] ? imageFiles[`image_${key}_3`][0].location : null;
            const image5 = imageFiles && imageFiles[`image_${key}_4`] ? imageFiles[`image_${key}_4`][0].location : null;

            await service.insertQuizDetail(uniqueId, quizList[key], image1, image2, image3, image4, image5);
        });

        // 모든 데이터베이스 작업이 완료된 후
        res.json({ quizId: uniqueId });
        console.log("퀴즈 생성 res:"+ uniqueId);

    } catch (error) {
        console.error("Error saving quiz:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/tempTest', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), function (req, res) {
    res.json({message: '이미지 업로드 성공'});
});