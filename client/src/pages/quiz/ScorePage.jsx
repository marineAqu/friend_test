import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../components/background/Background";
import DefaultButton from '../../components/button/DefaultButton';
import ShareLinkButton from '../../components/button/ShareLinkButton.jsx';
import Header from '../../components/header/Header';
import Nicknamebox from '../../components/nicknamebox/Nicknamebox';
import SetVhComponent from '../../components/vh/SetVhComponent.jsx';
import "./ScorePage.css";


const ScorePage = () => {
    const { answerId } = useParams(); // 경로
    const [quizId, setQuizId] = useState(0);
    const [score, setScore] = useState(0);
    const [quizname, setQuizName] = useState('민호');

    useEffect(() => {
        const handleGet = async () => {
            try {
                const response = await fetch('SCOREGET', {
                    method: 'GET',
                    body: JSON.stringify({
                        answerID: answerId,
                    })
                });

                const data = await response.json();
                setQuizId(data.quizId);
                setScore(data.score);
                setQuizName(data.quizname);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        handleGet(); // 자동호출

    }, [answerId]); // 컴포넌트 처음 랜더링 시 실행

    const navigate = useNavigate();

    const handleShowDetail = () => {
        navigate(`/score-detail/${answerId}`);
    }

    const handlePush = () => {
        navigate("/main/make");
    }


    return(
        <Background>
            <SetVhComponent/>
            <div className="mainInner">
                <Header/>
                <div className="title">친구 능력고사</div>
                <Nicknamebox nickname = {quizname}></Nicknamebox>
                <div className='scoreLayout'>
                    <h4>당신의 점수는...</h4>
                    <h1 style={{color: 'red'}}>{score}</h1> <h1>/10</h1>
                </div>
                <DefaultButton text="채점 결과 확인하기" variant='normal' onClick={handleShowDetail} />
                <h2>결과 공유하기</h2>
                <ShareLinkButton link={`http://localhost:3000/friend_test/score/${answerId}`} />
                <DefaultButton text="새로운 능력고사 만들러 가기" variant='normal' onClick={handlePush} />

            </div>
        </Background>
    );


}
export default ScorePage;