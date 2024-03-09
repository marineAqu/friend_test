import React from 'react';

const ImagePreview = ({ imageUrl }) => {
  return (
    <div className="image-preview" style={{ width: 'auto', height: '50px', backgroundColor: imageUrl ? 'transparent' : 'gainsboro' }}>
      {imageUrl && (
        <img src={imageUrl} alt="Image Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  );
};

export default ImagePreview;
