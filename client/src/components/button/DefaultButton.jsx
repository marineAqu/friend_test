import styled, { css } from "styled-components";


const StyledButton = styled.button`
    ${({ variantStyle }) => variantStyle}

    font-family: 'seoul-m';
    width: 340px;
    height: 48px;
    font-size: 20px;
    display: block;
    margin:0;
    cursor: pointer;
    color: var(--button-color);
    font-weight: 400;
    border: var(--button-border);
    border-radius: 10px;

    &:active,
    &:hover,
    &:focus {
    background: var(--button-hover-bg-color, #025ce2);
    }

    &:not(:disabled) {
        background-color: var(--button-bg-color);
    }

    &:disabled {
    cursor: default;
    opacity: 0.5;
    background: var(--button-bg-color, #025ce2);
    }
`;


function DefaultButton({ text, onClick, variant, disabled }) {
    const variantStyle = VARIANTS[variant];


    return (
        <StyledButton
            onClick={onClick}
            disabled={disabled}
            variantStyle={variantStyle}
        >{text}</StyledButton>
    );
}

const VARIANTS = {
  normal: css`
    --button-color: black;
    --button-bg-color: gainsboro;
    --button-hover-bg-color: #b0b0b0; /* hover 시 배경색 변수 추가 */
    --button-border: 1px solid black;
  `,
  grey: css`
    --button-color: #ffffff;
    --button-bg-color: #808080;
    --button-hover-bg-color: #a9a9a9; /* hover 시 배경색 변수 추가 */
    --button-border: 1px solid black;
  `,
  blue: css`
    --button-color: azure;
    --button-bg-color: rgb(83, 138, 231);
    --button-hover-bg-color: #708090; /* hover 시 배경색 변수 추가 */
    --button-border: none;
  `,
};


export default DefaultButton;