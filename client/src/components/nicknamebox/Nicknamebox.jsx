import styled from "styled-components";

const StyledNickname = styled.div`
    font-family: 'seoul-m';

    width: auto;
    max-width: 90vw;
    padding: 0px 15px;
    height: 60px;
    font-size: 30px;
    margin: 10px auto 40px auto;
    border-radius: 10px;
    line-height : 62px;
    border: 1.5px solid grey;
    background-color: rgb(248, 248, 248);
    display: inline-block;

    overflow: hidden; /* 넘친 텍스트 숨김 */
    text-overflow: ellipsis; /* 넘친 텍스트를 ...으로 표시 */
    white-space: nowrap; /* 텍스트를 한 줄에 표시 */

    margin-bottom: -10px;
`;

const MarginBox = styled.div`
    margin-bottom: 40px;
`;

function Nicknamebox ({nickname}) {
    return(
        <MarginBox>
            <StyledNickname> {nickname} </StyledNickname>
            <h3>영역</h3>
        </MarginBox>
    );

}

export default Nicknamebox;