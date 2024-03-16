//Sharepage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../../components/background/Background.jsx';
import DefaultButton from '../../components/button/DefaultButton';
import ShareLinkButton from '../../components/button/ShareLinkButton.jsx'; // 수정된 부분
import Header from '../../components/header/Header';
import './SharePage.css';


//TODO: 닉네임 get하는 api
const SharePage = () => {
  const navigate = useNavigate();

  const handlePush = () => {
    navigate("/main/make");
  }

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

  const nickname = "범고래";
  const sharelink = "http:/3000/shareplease";

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
