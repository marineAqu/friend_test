import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Number from '../../components/number/Number';


import './MakePage.css';


const MakePage = () => {

    /* 상태임. 초기값 1로 */
    const [page, setPage] = useState(1);
    
    const [formDataList, setFormDataList] = useState(Array(10).fill({
        question: '',
        answers: ['', '', '', '', ''],
        images: [null, null, null, null, null]
    }));

    const getFormData = (page) => {
        // 페이지에 따라 임시로 저장된 데이터
        return {
            question: '',
            answers: ['', '', '', '', ''],
            images: [null, null, null, null, null]
        };
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedFormDataList = [...formDataList];
        updatedFormDataList[index][name] = value;
        setFormDataList(updatedFormDataList);
    };

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...formDataList[index].answers];
        updatedAnswers[index] = value;
        const updatedFormDataList = [...formDataList];
        updatedFormDataList[index].answers = updatedAnswers;
        setFormDataList(updatedFormDataList);
    };

    const handleImageChange = (index, e) => {
        const updatedImages = [...formDataList[index].images];
        updatedImages[index] = e.target.files[0];
        const updatedFormDataList = [...formDataList];
        updatedFormDataList[index].images = updatedImages;
        setFormDataList(updatedFormDataList);
    };

    const handleSubmit = async () => {
        try {
            for (let i = 0; i < formDataList.length; i++) {
                await axios.post('/api/saveData', formDataList[i]);
            }
            console.log('데이터가 정상적으로 보내졌습니다!');
        } catch (error) {
            console.error('데이터 저장에 오류가 있습니다. 다시 시도하세요!', error);
        }
    };

    const navigate = useNavigate(); //navigate

    // 예시용
    const quizID = "4522";

    const handlePush = () => {
        navigate("/share?"+quizID);
    }

    const handleNextPage = () => {


        if (page < 10) {
            // 현재 페이지의 form 저장
            const updatedFormDataList = [...formDataList];
            setFormDataList(updatedFormDataList);

            // 다음페이지로
            setPage(page + 1);
        } else {
            // 현재 페이지의 form 저장
            const updatedFormDataList = [...formDataList];
            updatedFormDataList[page - 1] = formDataList[page - 1];
            setFormDataList(updatedFormDataList);
            // 10번째 페이지에서 완료 버튼을 눌렀을 때 로직 쓰기
            // 순서 바꿔야함 원래
            handlePush(5234);
            handleSubmit();
        }
    };

    const handleBeforePage = () => {
        if (1 < page < 11) {
            // 현재 페이지의 form 저장
            const updatedFormDataList = [...formDataList];
            setFormDataList(updatedFormDataList);
            setPage(page - 1);
        } else {
            setPage(1);
        }
    };



    return (
        <div className="outerLayout">
        <Header />
        <Number page={page} />
        <div className="inner">
            <div className="question">
                <h5>{page}. </h5>
                <input
                    type="text"
                    name="question"
                    value={formDataList[page - 1].question}
                    onChange={(e) => handleInputChange(e, page - 1)}
                    placeholder={`질문을 입력하세요`}
                />
            </div>
            <div className='all-answers'>
                <div className="all-numbers">
                    <h4>1</h4>
                    <h4>2</h4>
                    <h4>3</h4>
                    <h4>4</h4>
                    <h4>5</h4>
                </div>
                <div className="answers">
                    {formDataList[page - 1].answers.map((answer, index) => (
                        <input
                            key={index}
                            type="text"
                            value={answer}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder={`답변 ${page} - ${index + 1}`}
                        />
                    ))}
                </div>
                <div className="imageUpload">
                    {formDataList[page - 1].images.map((image, index) => (
                        // 예쁜 input 버튼
                        <input
                            key={index}
                            type="file"
                            onChange={(e) => handleImageChange(index, e)}
                            accept="image/*"
                        />
                    ))}
                </div>
            </div>
            <button onClick={handleBeforePage} style={{ visibility: page > 1 ? 'visible' : 'hidden' }}>이전</button>
            <button onClick={handleNextPage}>{page < 9 ? '다음' : '완료'}</button>
            <button >자동생성</button>
            
        </div>
    </div>
);
};

export default MakePage;

