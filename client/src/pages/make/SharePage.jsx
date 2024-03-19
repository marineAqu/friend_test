//Sharepage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from '../../components/background/Background.jsx';
import DefaultButton from '../../components/button/DefaultButton';
import ShareLinkButton from '../../components/button/ShareLinkButton.jsx'; // 수정된 부분
import Header from '../../components/header/Header';
import './SharePage.css';


//TODO: 닉네임 get하는 api
const SharePage = () => {
  const [nickname, setNickname] = useState("test");
  const [sharelink, setSharelink] = useState("http:/3000/shareplease");

  const navigate = useNavigate();

  const handlePush = () => {
    navigate("/main/make");
  }

    /* param으로 name 받아놓음 */
    const { quizId } = useParams();

  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  useEffect(() => {
    setVh();

    function onResize(){
      setVh()
    }

    window.addEventListener('resize', onResize);
  }, [])


  useEffect(() => {
    const handleGet = async () => {
        try {
            const response = await fetch('sharepage', {
                method: 'GET',
                body: JSON.stringify({
                    quizId: quizId,
                })
            });

            const data = await response.json();
            setNickname(data.nickname);
            setSharelink("http:/3000/" + {quizId})

        } catch (error) {
            console.error('Error:', error);
        }
    };

    handleGet();

}, [quizId]); // 컴포넌트 처음 랜더링 시 실행



  return (
    <Background>
      <Header />
      <div className="innerLine">
        <div className="title">친구 능력고사</div>
        <div className='nickname'>{nickname} 영역</div>

        <h2>공유하기</h2>
        <ShareLinkButton link={sharelink} />
        <DefaultButton text="새로운 능력고사 만들러 가기" variant='normal' onClick={handlePush} />
      </div>
    </Background>
  );
};

export default SharePage;
