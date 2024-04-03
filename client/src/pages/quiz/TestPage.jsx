import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import Background from "../../components/background/Background";
import Header from '../../components/header/Header';
import Number from '../../components/number/Number';
import TestBlock from '../../components/testblock/Testblock';
import SetVhComponent from '../../components/vh/SetVhComponent';
import './TestPage.css';

const TestPage = () => {

    const navigate = useNavigate(); //navigates

    const { quizId } = useParams(); // 경로
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name'); // name 받기
    const [answerNo, setAnswerNo] = useState(0);

    const [page, setPage] = useState(0);
    const [quizList, setQuizList] = useState(Array.from({ length: 10 }, () => ({
        questionDetail: `test ${page + 1}`,
        questionNo: page + 1,
        correctNo: 1,
        answers: ['tesddddddddddddddddt1', 'test2', 'test3', 'test4', 'test5'],
        images: [null, null, null, null, null]
    })));

    const handleCkAnswer = (qidx, aidx) => {
        const updateAnswerList = [...answerList];
        updateAnswerList[qidx] = aidx;
        setAnswerList(updateAnswerList);
    
        if(page < 9){
            setPage(page+1);
        } else {
            console.log(updateAnswerList);    //체크용
            handleSubmit();
            navigate(`/score/${answerNo}`);
        }
    }

    function formatter(receivedData) {
        return receivedData.map(data => ({
            answers: [data.answer1, data.answer2, data.answer3, data.answer4, data.answer5],
            correctNo: data.correct_no,
            images: [data.image1, data.image2, data.image3, data.image4, data.image5],
            questionDetail: data.question_detail,
            questionNo: data.question_no
        }));
    }



    const [answerList, setAnswerList] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    useEffect(() => {
        const handleGet = async () => {
            try {
                const response = await fetch('/getquiz', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quizId: quizId,
                    })
                });

                const data = await response.json();
                const getQuizList = formatter(data.quizList);
                setQuizList(getQuizList);
                console.log(getQuizList);
                console.log(quizList);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        handleGet(); // 자동호출

    }, [quizId]); // 컴포넌트 처음 랜더링 시 실행

    const handleSubmit = async (updateAnswerList) => {
        try {
            const response = await fetch('/saveAnswer', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quizId: quizId,
                    answerName: name,
                    answerList: updateAnswerList,
                })
            });

            const data = await response.json();
            const answerNo = data.answerNo;
            setAnswerNo(answerNo);
            console.log(data);
            console.log(answerNo);

        } catch (error) {
            console.error('Error:', error);
        }
    };


    return(
        <Background>
            <SetVhComponent/>
            <Header/>
            <Number page={page+1}/>

            {Array.isArray(quizList) && quizList.map((val, qidx)=>
            <div className='quizList' style={{display:page===qidx?'flex':'none'}}>
                <div className='quizLayout'>
                    {page+1}. {val.questionDetail}
                </div>
                <div className='answerLayout'>
                    {Array.isArray(val.answers) && val.answers.map((aval, aidx) => (
                        <TestBlock text={aval}
                                   file={Array.isArray(val.images) ? val.images[aidx] : undefined}
                                   variant='normal'
                                   onClick={()=>handleCkAnswer(qidx, aidx+1)}
                        />
                        ))}
                </div>
            </div>
            )}
        </Background>
    );



}
export default TestPage;