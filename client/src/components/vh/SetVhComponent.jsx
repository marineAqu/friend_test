import { useEffect } from 'react';

const SetVhComponent = () => {
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

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default SetVhComponent;
