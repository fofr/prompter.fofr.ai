import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import PromptAutocomplete from './PromptAutocomplete';
import PromptPreview from './PromptPreview';

const PromptForm = () => {
  const [inputValue, setInputValue] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Define the fetch function
  const generate = (nextValue) => {
    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: nextValue })
    })
    .then((response) => response.json())
    .then((data) => {
      setGeneratedPrompt(data)
    })
    .catch((error) => {
      console.error('Failed to generate:', error);
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const debouncedGenerate = debounce(generate, 500);
    debouncedGenerate(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setInputValue(value);
    generate(value);
  };

  return (
    <div>
      <form
        className="w-full"
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <label className="block mb-2" htmlFor="prompt">
          Prompt template
        </label>
        <div className="flex">
          <PromptAutocomplete value={inputValue} onSubmit={handleSubmit} />
        </div>
        <button className="button" type="submit">
          Generate
        </button>
      </form>

      <PromptPreview generatedPrompt={generatedPrompt} />
    </div>
  );
};

export default PromptForm;
