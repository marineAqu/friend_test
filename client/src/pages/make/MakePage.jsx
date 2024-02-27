import React, { useEffect } from 'react';
import Header from '../../components/header/Header';
import './MakePage.css';

const MakePage = () =>{

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


    return (
      <div className="outerLayout">
        <Header />
        <div className="inner">
          <h4>10문제로 알아보는</h4>
          <div className="title">친구 능력고사 만들기 페이지</div>
          <h4>나는 내 친구에 대해</h4>
          <h4>얼마나 알고 있을까?</h4>
        </div>

      </div>
    );
  };

export default MakePage;