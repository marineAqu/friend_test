import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Background from "../../components/background/Background";
import DefaultButton from '../../components/button/DefaultButton';
import Header from '../../components/header/Header';
import Number from '../../components/number/Number';
import TestBlock from '../../components/testblock/Testblock';
import SetVhComponent from '../../components/vh/SetVhComponent';

const ScoreDetailPage = () => {
    const navigate = useNavigate(); //navigates

    const { quizId } = useParams(); // 경로
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name'); // name 받기
    const [answerId, setAnswerId] = useState(0);

    const [page, setPage] = useState(0);
    const [quizList, setQuizList] = useState(Array.from({ length: 10 }, () => ({
        questionDetail: `test ${page + 1}`,
        questionNo: page + 1,
        correctNo: 1,
        answers: ['tesddddddddddddddddt1', 'test2', 'test3', 'test4', 'test5'],
        images: [null, null, null, null, null]
    })));

    const handleNextPage = (qidx, aidx) => {
        if(page < 9){
            setPage(page+1);
        } else {
            handleSubmit();
            navigate(`/score/${answerId}`);
        }
    }
    

    const [answerList, setAnswerList] = useState([1, 1, 1, 1, 1, 1, 1, 2, 2, 2])

    useEffect(() => {
        const handleGet = async () => {
            try {
                const response = await fetch('SCOREDETAILGET', {
                    method: 'GET',
                    body: JSON.stringify({
                        answerId: answerId,
                    })
                });

                const data = await response.json();

                // quizList와 answerList 불러옴
                setQuizList(data.quizList);
                setAnswerList(data.answerList);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        handleGet(); // 자동호출

    }, [answerId]); // 컴포넌트 처음 랜더링 시 실행

    const handleSubmit = async (updateAnswerList) => {
        try {
            const response = await fetch('ANSWERPOST', {
                method: 'POST',
                body: JSON.stringify({
                    quizId: quizId,
                    answerName: name,
                    answerList: updateAnswerList,
                })
            });

            const data = await response.json();
            const answerid = data.answerid;
            setAnswerId(answerid);
            console.log(data);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <Background>
            <SetVhComponent/>
            <Header/>
            <Number page={page+1}/>
    
            {quizList.map((val, qidx)=>
            <div className='quizList' style={{display:page===qidx?'flex':'none'}}>
                <div className='quizLayout'>
                    {page+1}. {val.questionDetail}
                </div>
                <div className='answerLayout'>
                    {val.correctNo === answerList[page] ?   // 틀렸다면 후자 맞았다면 전자
                        val.answers.map((aval, aidx) => (
                            <TestBlock text={aval}
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
                            <TestBlock text={aval}
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
    