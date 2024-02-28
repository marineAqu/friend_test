import React from 'react';
import { CopyToClipboard } from "react-copy-to-clipboard/src";
import './ShareLinkButton.css'; // CSS 파일 import

const ShareLinkButton = ({ link }) => {
  return (
    <div>
      <div className='share-link'>{link}</div>
      <CopyToClipboard text={link} onCopy={() => alert("클립보드에 링크가 복사되었습니다.")}>
        <button className='copy-link'>링크 복사하기</button>
      </CopyToClipboard>
    </div>
  );
};

export default ShareLinkButton;

