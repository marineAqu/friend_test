import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Background from "../../components/background/Background";
import DefaultButton from '../../components/button/DefaultButton';
import Header from '../../components/header/Header';
import Nicknamebox from '../../components/nicknamebox/Nicknamebox';
import "./MainTestPage.css";

const MainTestPage = () => {

    const [quizname, setQuizname] = useState("test");
    const [username, setUsername] = useState("");

    const navigate = useNavigate(); //navigate

    const { quizId } = useParams(); //param에서 ID 받기

    const handleChange = (event) => {
        setUsername(event.target.value);
    }

    const handleSubmit = () => {
        if (username.trim() !== "") {
            const a = document.getElementById('username').value;
            navigate(`/test/${quizId}?name=` + a);
        } else {
            alert("제출자 이름을 입력해주세요");
        }
    }

    useEffect(() => {
        const handleGet = async () => {
            try {
                const response = await fetch('testmain', {
                    method: 'GET',
                    body: JSON.stringify({
                        quizId: quizId,
                    })
                });
    
                const data = await response.json();
                setQuizname(data.quizname);
    
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        handleGet();
    
    }, [quizId]); // 컴포넌트 처음 랜더링 시 실행
    


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

                <Nicknamebox nickname = {quizname}></Nicknamebox>

                <input id="username" name="name" type="text" value={username} onChange={handleChange}
                placeholder='제출자 이름을 입력해주세요' maxLength={20} required/>
                <DefaultButton text="퀴즈 맞추기!" variant='normal' onClick={handleSubmit} />
            </div>
        </Background>
    );
}

export default MainTestPage;
