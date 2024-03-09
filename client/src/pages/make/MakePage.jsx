import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultButton from '../../components/button/DefaultButton';
import Header from '../../components/header/Header';
import Number from '../../components/number/Number';

import ImagePreview from '../../components/imagepreview/ImagePreview';
import './MakePage.css';


const MakePage = () => {
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    useEffect(() => {

        setVh();

        function onResize() {
            setVh()
        }

        window.addEventListener('resize', onResize);
    }, [])


    /* param으로 name 받아놓음 */
    const { name } = useParams();

    /* post로 받은 값 저장함, 원래 null이고 예시로 바꿈 */
    const [quizId, setQuizId] = useState(1234);




    /* 페이지, 퀴즈 폼 정의. page는 0~9 */
    const [page, setPage] = useState(0);
    const [quizList, setQuizList] = useState(Array.from({ length: 10 }, () => ({
        questionDetail: '',
        questionNo: page + 1,
        correctNo: 1,
        answers: ['', '', '', '', ''],
        images: [null, null, null, null, null]
    })));

    /* 순서대로 질문, 답변, 파일, 정답 int 저장하는 메소드 */

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const updatedQuizList = [...quizList]; // 지금까지 저장된 퀴즈 리스트 얕은복사
        updatedQuizList[page][name] = value;
        setQuizList(updatedQuizList);   // 저장
    };

    const handleAnswerChange = (event) => {
        const { name, value } = event.target;
        setQuizList(prevQuizList => {
            const updatedQuizList = [...prevQuizList];
            updatedQuizList[page] = {
                ...updatedQuizList[page],
                answers: updatedQuizList[page].answers.map((answer, index) =>
                    name === `answer${index}` ? value : answer
                )
            };
            return updatedQuizList;
        });
    };


    const handleFileInputChange = (event, index) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = () => {
            const imageUrl = reader.result;
            const updatedQuizList = [...quizList];
            updatedQuizList[page].images[index] = {
                file: file,
                imageUrl: imageUrl
            };
            setQuizList(updatedQuizList);
        };
        
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleCorrectNoChange = (correctNo) => {
        const updatedQuizList = [...quizList];
        updatedQuizList[page].correctNo = correctNo;
        setQuizList(updatedQuizList);
    };

    const navigate = useNavigate();

    // quizId 기본값 손보기
    const handlePush = () => {
        navigate("/share/" + quizId);
    }

    const handleNextPage = () => {
        if (page < 9) {
            // 다음페이지로
            setPage(page + 1);
            // 페이지 넘어가면 그 페이지의 questionNo 페이지 값으로 자동 업데이트
            const updatedQuizList = [...quizList];
            updatedQuizList[page].questionNo = page + 1;
            setQuizList(updatedQuizList);
        } else {
            // no 설정을 해주지 않아서 1로 삽입되었음
            const updatedQuizList = [...quizList];
            updatedQuizList[page].questionNo = page + 1;
            setQuizList(updatedQuizList);
            handleSubmit();
            console.log(quizList);
            handlePush();
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('quizList', JSON.stringify(quizList));

            // 파일 데이터를 FormData에 추가
            quizList.forEach((quiz, index) => {
                quiz.images.forEach((image, imageIndex) => {
                    formData.append(`image_${index}_${imageIndex}`, image);
                });
            });

            const response = await fetch('/saveMadeQuiz', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            const quizId = data.id;
            setQuizId(quizId);

            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };




    return (
        <div className="outerLayout">
            <Header className="header"/>
            <Number page={page + 1} className="number" />
            <div className="inner">

                <form>
                    <div className='question-container'>
                        <h3> {page+1}. </h3>
                        <input
                            type="text"
                            name="questionDetail"
                            value={quizList[page].questionDetail}
                            onChange={handleInputChange}
                            placeholder="질문을 입력하세요"
                        />
                    </div>

                    <div className='get-correctNo'>
                        {[1, 2, 3, 4, 5].map(option => (
                            <React.Fragment key={option}>
                                <input type="radio"
                                id={`corr${option}`}
                                name="correctNo"
                                value={option}
                                onChange={() => handleCorrectNoChange(option)}
                                />
                                <label htmlFor={`corr${option}`}>{option}</label>
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="answer-container">
                        {quizList[page].answers.map((answer, index) => (
                            <input
                                key={index}
                                type="text"
                                name={`answer${index}`}
                                value={answer}
                                onChange={handleAnswerChange}
                                placeholder={`답변 ${index + 1}`}
                            />
                        ))}
                    </div>
                    <div className="image-container">
                        {quizList[page].images.map((image, index) => (
                            <div key={index}>
                                <ImagePreview imageUrl={image ? image.imageUrl : null} />
                                <label htmlFor={`file-${index}`}><div class="btn-upload">이미지 업로드</div></label>
                                <input
                                    type="file"
                                    id={`file-${index}`}
                                    onChange={(event) => handleFileInputChange(event, index)}
                                />
                            </div>
                        ))}
                    </div>

                </form>
                <div className='bottom'>
                    <DefaultButton text={page < 9 ? '다음' : '완료'} onClick={handleNextPage} variant={page < 9 ? 'normal' : 'grey'}/>
                    <DefaultButton text="자동생성" variant='blue' />
                </div>
            </div>
        </div>
    );
};

export default MakePage;

