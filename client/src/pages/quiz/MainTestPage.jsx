import React from 'react';
import { useNavigate } from 'react-router-dom';
import Background from "../../components/background/Background";
import DefaultButton from '../../components/button/DefaultButton';
import Header from '../../components/header/Header';
import Nicknamebox from '../../components/nicknamebox/Nicknamebox';
import "./MainTestPage.css";

const MainTestPage = () => {

    const navigate = useNavigate(); //navigate

    const handleSubmit= (event) => {
        navigate(`/test/${name}`);
    }

    const name = "신스언니";

    return (
        <Background>
            <Header/>
            <div className="mainInner">
                <h4>10문제로 알아보는</h4>
                <div className="title">친구 능력고사</div>
                <div className="description">
                <h4>나는 내 친구에 대해</h4>
                <h4>얼마나 알고 있을까?</h4>
                </div>

                <Nicknamebox nickname = {name}></Nicknamebox>
                <DefaultButton text="퀴즈 맞추기!" variant='normal' onClick={handleSubmit} />

                
            </div>
        </Background>
    );
}

export default MainTestPage;
