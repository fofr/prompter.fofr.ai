import React from 'react';

const PromptPreview = ({ generatedPrompt }) => {
  if (!generatedPrompt) {
    return null;
  }

  return (
    <div className="bg-gray-200 rounded-lg p-4 relative">
      <div>
        <span className="text-gray-500">Prompt preview</span>
        <div className="font-bold text-lg">
          {generatedPrompt}
        </div>
      </div>
    </div>
  );
};

export default PromptPreview;
