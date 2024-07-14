//MainMakePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../../components/background/Background';
import Header from '../../components/header/Header';
import './MainMakePage.css';





const MainMakePage = () =>{


  const [name, setName] = useState("");

  const navigate = useNavigate(); //navigate

  const handleChange = (event) => {
    setName(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    //만약 이미 퀴즈를 만들지 않았다면
    if (!localStorage.getItem('userId')) {
      navigate(`/make/${name}`);
    }
    //이미 이전에 퀴즈를 만들었다면
    else{
      alert("이미 생성한 퀴즈가 있습니다.");
    }
    
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


  return (
    <Background>
      <div className="innerLine">
        <Header />
        <h4>10문제로 알아보는</h4>
        <div className="title">친구 능력고사</div>
        <div className="description">
          <h4>나는 내 친구에 대해</h4>
          <h4>얼마나 알고 있을까?</h4>
        </div>


        <form onSubmit={handleSubmit}>
          <input id="name" name="name" type="text" value={name} onChange={handleChange}
          placeholder='제출자 이름을 입력해주세요' maxLength={20} required/>
          <button className="mainButton" type="submit">퀴즈 만들기</button>
        </form>
      </div>
    </Background>
  );
  };

export default MainMakePage;