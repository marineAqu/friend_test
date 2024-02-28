import React from 'react';
import styled from "styled-components";


function DefaultButton({text}) {
    const variantStyle = VARIANTS[variant];


    return (
        <StyledButton
        disabled={disabled}
        variantStyle={variantStyle}
        >{text}</StyledButton>
    )
}

const VARIANTS = {
    normal: css`
        --button-color: black;
        --button-bg-color: gainsboro;
        --button-hover-bg-color: grey;
        --button-border: 1px solid black;
    `,
    grey: css`
        --button-color: #ffffff;
        --button-bg-color: grey;
        --button-hover-bg-color: grey;
    `,
    blue: css`
        --button-color: #ffffff;
        --button-bg-color: blue;
        --button-hover-bg-color: #grey;
    `,
    };

const StyledButton = styled.button`
    ${(p) => p.variantStyle}

    
    width: 240px;
    height: 48px;
    font-size: 24px;
    display: block;
    margin:0;
    cursor: pointer;
    border-radius: 10px;

    &:active,
    &:hover,
    &:focus {
    background: var(--button-hover-bg-color, #025ce2);
    }

    &:disabled {
    cursor: default;
    opacity: 0.5;
    background: var(--button-bg-color, #025ce2);
    }
`;

// App.js에서 import 하기위해 해당 코드를 추가한다.
export default DefaultButton;