import React from 'react';

const Prompts = ({ generatedPrompts }) => {
  if (!generatedPrompts || generatedPrompts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 rounded-lg p-6 mt-12">
      <h2 class="text-2xl mb-4 font-bold">Your prompts</h2>
      <ul>
        {generatedPrompts.map((prompt, index) => (
          <li key={`${prompt}-${index}`} className="py-3 text-l border-gray-300 border-b">
            <div className="text-m">
              {prompt}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Prompts;
