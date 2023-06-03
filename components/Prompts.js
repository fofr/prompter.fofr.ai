import React, { useRef, useEffect, useState } from 'react';
import { ClipboardDocumentIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';
import { set } from 'lodash';

const Prompts = ({ generatedPrompts }) => {
  const promptsRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (e) => {
    e.preventDefault();
    const promptsToCopy = generatedPrompts.join('\n');
    navigator.clipboard.writeText(promptsToCopy).then(function() {
      setIsCopied(true);
    }, function() {
      console.error('Failed to copy text to clipboard');
    });
  };

  useEffect(() => {
    setIsCopied(false);
  }, [generatedPrompts]);

  useEffect(() => {
    promptsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generatedPrompts]);

  if (!generatedPrompts || generatedPrompts.length === 0) {
    return null;
  }

  return (
    <div ref={promptsRef} className="mt-4 pt-12">
      <h2 class="text-6xl mb-8 calistoga flex-grow text-center">Your prompts</h2>
      <div class="flex mb-8">
        {!isCopied && (
          <button className="flex-grow bg-white border-2 border-violet-800 text-violet-800 rounded-md block px-5 py-3 mt-0 " onClick={copyToClipboard}>
            <ClipboardDocumentIcon className="h-6 w-6 -ml-2 mr-1 inline-block" /> Copy prompts
          </button>
        )}
        {isCopied && (
          <button className="flex-grow bg-white border-2 border-green-600 text-green-600 rounded-md block px-5 py-3 mt-0" onClick={copyToClipboard}>
            <DocumentCheckIcon className="h-6 w-6 -ml-2 mr-1 text-color-white inline-block" /> Copied
          </button>
        )}
      </div>
      <ul className="bg-amber-50 p-4">
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
