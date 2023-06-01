import React from 'react';

const PromptPreview = ({ promptPreview }) => {
  if (!promptPreview) {
    return null;
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div>
        <span className="text-gray-500">Prompt preview</span>
        <div className="font-bold text-lg">
          {promptPreview}
        </div>
      </div>
    </div>
  );
};

export default PromptPreview;
