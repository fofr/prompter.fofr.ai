import React, { useRef, useEffect } from 'react';

const Prompts = ({ generatedPrompts }) => {
  const promptsRef = useRef(null);

  useEffect(() => {
    promptsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generatedPrompts]);

  if (!generatedPrompts || generatedPrompts.length === 0) {
    return null;
  }

  return (
    <div ref={promptsRef} className="mt-4 pt-8">
      <h2 class="text-4xl mb-4 calistoga">Your prompts</h2>
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
