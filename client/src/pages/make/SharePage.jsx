//Sharepage.jsx

import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Background from '../../components/background/Background.jsx';
import DefaultButton from '../../components/button/DefaultButton';
import ShareLinkButton from '../../components/button/ShareLinkButton.jsx'; // 수정된 부분
import Header from '../../components/header/Header';
import ScoreBoard from '../../components/scoreboard/ScoreBoard.jsx';
import './SharePage.css';


//TODO: 닉네임 get하는 api
const SharePage = () => {
    /* param으로 name 받아놓음 */
    const {quizId} = useParams();
    const [nickname, setNickname] = useState("test");
    const [sharelink, setSharelink] = useState(`http://34.47.81.121:3002/friend_test/share/${quizId}`);

    const navigate = useNavigate();

    const handlePush = () => {
        navigate("/friend_test/main/make");
    }

    const handleTestAgain = () => {
        navigate("/friend_test/main/test/" + quizId);
    }

    useEffect(() => {
        if (quizId !== undefined) {
            console.log(quizId);
            const handleGet = async () => {
                try {
                    const response = await fetch('/sharepage', {
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
                    setNickname(data.nickname);
                    setSharelink(`http://34.47.81.121:3002/friend_test/share/${quizId}`)

                } catch (error) {
                    console.error('Error:', error);
                }
            };

            handleGet();
        }
    }, [quizId]); // 컴포넌트 처음 랜더링 시 실행



    return (
        <Background>
            <Header/>
            <div className="innerLine">
                <div className="title">친구 능력고사</div>
                <div className='nickname'>{nickname} 영역</div>
                <ScoreBoard quizId={quizId}/>

                <h2>공유하기</h2>
                <ShareLinkButton link={sharelink}/>
                <DefaultButton text="테스트 도전하기" variant='blue' onClick={handleTestAgain}/>
                <DefaultButton text="새로운 능력고사 만들러 가기" variant='red' onClick={handlePush}/>
            </div>
        </Background>
    );
};

export default SharePage;
