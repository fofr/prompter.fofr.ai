import React from 'react';

const PromptPreview = ({ promptPreview }) => {
  if (!promptPreview) {
    return null;
  }

  return (
    <div className="bg-orange-100 mt-4 p-4">
      <div className="text-lg">
        <h3 className="font-bold mb-2">Preview:</h3>
        {promptPreview}
      </div>
    </div>
  );
};

export default PromptPreview;
