import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../components/background/Background";
import DefaultButton from '../../components/button/DefaultButton';
import Header from '../../components/header/Header';
import Number from '../../components/number/Number';
import TestBlock from '../../components/testblock/Testblock';
import SetVhComponent from '../../components/vh/SetVhComponent';

const ScoreDetailPage = () => {
    const navigate = useNavigate(); //navigates

    const { answerNo } = useParams(); // 경로

    const [page, setPage] = useState(0);
    const [quizList, setQuizList] = useState([]); // 초기 상태를 빈 배열로 설정
    const [answerList, setAnswerList] = useState([]); // 초기 상태를 빈 배열로 설정
    // const [answerList, setAnswerList] = useState([1, 1, 1, 1, 1, 1, 1, 2, 2, 2]);
    // const [quizList, setQuizList] = useState(Array.from({ length: 10 }, () => ({
    //     questionDetail: `test ${page + 1}`,
    //     questionNo: page + 1,
    //     correctNo: 1,
    //     answers: ['tesddddddddddddddddt1', 'test2', 'test3', 'test4', 'test5'],
    //     images: [null, null, null, null, null]
    // })));

    function formatter(receivedData) {
        return receivedData.map(data => ({
            answers: [data.answer1, data.answer2, data.answer3, data.answer4, data.answer5],
            correctNo: data.correct_no,
            images: [data.image1, data.image2, data.image3, data.image4, data.image5],
            questionDetail: data.question_detail,
            questionNo: data.question_no
        }));
    }

    function answerFormatter(receivedAnswer) {
        const answers = [];
        for (let i = 1; i <= 10; i++) {
            answers.push(receivedAnswer[`answer${i}`]);
        }
        return answers;
    }


    const handleNextPage = (qidx, aidx) => {
        if(page < 9){
            setPage(page+1);
        } else {
            navigate(`/score/${answerNo}`);
        }
    }


    useEffect(() => {

        console.log(answerNo);
        const handleGet = async () => {
            try {
                const response = await fetch('/scoredetail', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        answerNo: answerNo,
                    })
                });

                const data = await response.json();

                // quizList와 answerList 불러옴
                const getQuizList = formatter(data.quizList);
                const getAnswerList = answerFormatter(data.answerList);
                setQuizList(getQuizList);
                setAnswerList(getAnswerList);
                console.log(data.answerList);
                console.log(getQuizList);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        handleGet(); // 자동호출

    }, [answerNo]); // 컴포넌트 처음 랜더링 시 실행

    useEffect(() => {
        // quizList와 answerList가 모두 설정된 후에 resultList 계산
        if (quizList.length > 0 && answerList.length > 0) {
            const resultList = quizList.map((quiz, index) => answerList[index] === quiz.correctNo);
            setResultList(resultList);
        }
    }, [quizList, answerList]);

    const [resultList, setResultList] = useState([]);



    return(
        <Background>
            <SetVhComponent/>
            <Header/>
            <Number page={page+1} mode='score' resultList={resultList}/>
    
            {quizList && quizList.map((val, qidx)=>
            <div className='quizList' style={{display:page===qidx?'flex':'none'}} key={qidx}>
                <div className='quizLayout'>
                    {page+1}. {val.questionDetail}
                </div>
                <div className='answerLayout'>
                    {val.correctNo === answerList[page] ?   // 틀렸다면 후자 맞았다면 전자
                        val.answers.map((aval, aidx) => (
                            <TestBlock
                                text={aval}
                                file={val.images[aidx]}
                                variant={(aidx+1 === answerList[page]) ? 'blue' : 'normal'}
                            />
                        ))
                    :
                    val.answers.map((aval, aidx) => {

                        // 원래 답 green, 틀린 답 red, 나머지 normal
                        let variant;
                        if (aidx+1 === answerList[page]) {
                            variant = 'red';
                        } else if (aidx+1 === val.correctNo) {
                            variant = 'green';
                        } else {
                            variant = 'normal';
                        }

                        return (
                            <TestBlock
                                text={aval}
                                file={val.images[aidx]}
                                variant={variant}
                            />
                        );
                    })
                    
                    }
                <div className='bottom' style={{ marginTop: '20px' }}>
                    <DefaultButton text={page<9?"다음":"돌아가기"} variant='normal' onClick={handleNextPage} />
                </div>

                </div>
            </div>
            
            )}
        </Background>
    );
    
}
export default ScoreDetailPage;
    