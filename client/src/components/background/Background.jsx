import styled, { createGlobalStyle } from "styled-components";
import SetVhComponent from "../vh/SetVhComponent.jsx";




const GlobalStyle = createGlobalStyle`

    body, p {
        margin: 0;
    }
`;

const BackgroundImage = styled.body`
    font-family: 'seoul-s';
    width: 100vw;
    height: calc(var(--vh,1vh)*100);
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
`;

const InnerBox = styled.div`

    height: calc(var(--vh,1vh)*100);
    padding-top: calc(var(--vh,1vh)*30);
    text-align: center;

    @media (min-width: 1000px) {
        width: 600px;
        border-right: 1px solid black;
        border-left: 1px solid black;
    }
`;




function Background({ children }) {
    return (
        <>
            <SetVhComponent />
            <GlobalStyle />
            <BackgroundImage>
                <InnerBox>{children}</InnerBox>
            </BackgroundImage>
            
        </>
    );
}
export default Background;

