import styled, { css } from "styled-components";

const StyledTestBlock = styled.button`
    ${({ variantStyle }) => variantStyle}

    font-family: 'seoul-m';
    width: 156px;
    height: 170px;
    font-size: 18px;
    display: block;
    cursor: pointer;
    color: var(--button-color);
    font-weight: 400;
    border: var(--button-border);
    border-radius: 10px;
    word-wrap: break-word;
    
    background-color: var(--button-bg-color);

    &:hover,
    &:focus {
    background: var(--button-hover-bg-color, #025ce2);
    }

    &:active {
        background: var(--button-active-bg-color, #025ce2);
    }

`;

function TestBlock({text, file, variant, onClick}){
    const variantStyle = VARIANTS[variant];

    return(
        <StyledTestBlock
            onClick={onClick}
            variantStyle={variantStyle}
        >
            {file && (
                <div className="image-view" style={{ width: 'auto', maxWidth: '140px', height: '70px', backgroundColor: 'transparent'}}>
                    <img src={file} alt="Image Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}
            {text}
        </StyledTestBlock>


    );

}

const VARIANTS = {
    normal: css`
    --button-color: black;
    --button-bg-color: white;
    --button-hover-bg-color: #90ee90;
    --button-active-bg-color: #90ee90;
    --button-border: 1px solid black;
    `,
    red: css`
    --button-color: #ffffff;
    --button-bg-color: #ff0000;
    --button-hover-bg-color: #b22222;
    --button-border: none;
    `,
    blue: css`
    --button-color: azure;
    --button-bg-color: rgb(83, 138, 231);
    --button-hover-bg-color: #708090;
    --button-border: none;
    `,
    green: css`
    --button-color: #ffffff;
    --button-bg-color: #008000;
    --button-hover-bg-color: #006400;
    --button-border: none;
    `,
    };
    


export default TestBlock;