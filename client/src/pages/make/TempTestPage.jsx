import React, { useState } from 'react';

const TempTestPage = () => {
    const [images, setImages] = useState([]);

    // 이미지 변경 핸들러
    const handleImageChange = (event) => {
        const selectedImages = event.target.files;
        setImages([...images, ...selectedImages]);
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = async () => {
        // 이미지 업로드 로직을 구현합니다.
        if (images.length > 0) {
            console.log('업로드된 이미지:', images);

            const formData = new FormData();
            images.forEach((image, index) => {
                console.log("image에 값이 들었는지 확인용: "+JSON.stringify(image));
                formData.append(`image${index + 1}`, image);
            });

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
            {/* 여러 개의 input 요소를 추가합니다. */}
            <input type="file" id={'tempImg'} accept="image/*" onChange={handleImageChange} />
            <input type="file" id={'tempImg2'} accept="image/*" onChange={handleImageChange} />
            {/* 필요에 따라 더 많은 input 요소를 추가할 수 있습니다. */}
            <button onClick={handleImageUpload}>이미지 업로드</button>
            {images.map((image, index) => (
                <div key={index}>
                    <h3>{`선택된 이미지 ${index + 1}`}</h3>
                    <img src={URL.createObjectURL(image)} alt={`선택된 이미지 ${index + 1}`} width="200" />
                </div>
            ))}
        </div>
    );
};

export default TempTestPage;
