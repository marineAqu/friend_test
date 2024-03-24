import React, { useState } from 'react';

const TempTestPage = () => {
    const [image, setImage] = useState(null);

    // 이미지 변경 핸들러
    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage);
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = async () => {
        // 이미지 업로드 로직을 구현합니다. 여기서는 간단히 이미지를 콘솔에 로그합니다.
        if (image) {
            console.log('업로드된 이미지:', image);

            const formData = new FormData();
            formData.append('image', image);

            try {
                const response = await fetch('/tempTest', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                console.log('서버 응답:', data);
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
            }
        } else {
            console.log('이미지를 선택해주세요.');
        }
    };

    return (
        <div>
            <h2>이미지 업로더</h2>
            <input type="file" id={'tempImg'} accept="image/*" onChange={handleImageChange} />
            <button onClick={handleImageUpload}>이미지 업로드</button>
            {image && (
                <div>
                    <h3>선택된 이미지</h3>
                    <img src={URL.createObjectURL(image)} alt="선택된 이미지" width="200" />
                </div>
            )}
        </div>
    );
};

export default TempTestPage;
