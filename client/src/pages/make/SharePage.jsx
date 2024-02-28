//Sharepage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="outerLayout">
      <div className="innerLine">
        <Header />
        <div className="title">친구 능력고사</div>
        <div className='nickname'>{nickname} 영역</div>

        <h2>공유하기</h2>
        <ShareLinkButton link={sharelink} /> {/* 수정된 부분 */}
        <button className='back-main' onClick={handlePush}>새로운 능력고사 만들러 가기</button>
      </div>
    </div>
  );
};

export default SharePage;
