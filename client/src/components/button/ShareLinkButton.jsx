import React from 'react';
import { CopyToClipboard } from "react-copy-to-clipboard/src";
import './ShareLinkButton.css';
import DefaultButton from "./DefaultButton";

const ShareLinkButton = ({ link }) => {
  return (
    <div>
      <div className='share-link'>{link}</div>
      <CopyToClipboard text={link} onCopy={() => alert("클립보드에 링크가 복사되었습니다.")}>
          <DefaultButton
              text='링크 복사하기'
              variant='normal'
              onClick={() => {}}
          />
      </CopyToClipboard>
    </div>
  );
};

export default ShareLinkButton;

