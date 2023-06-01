import React, { useState, useRef } from 'react';
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
      setGeneratedPrompt(data);
    })
    .catch((error) => {
      console.error('Failed to generate:', error);
    });
  };

  // Define debouncedGenerate outside of handleChange
  const debouncedGenerate = useRef(debounce(generate, 500)).current;

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedGenerate(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generate(inputValue);
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
          <PromptAutocomplete value={inputValue} handleChange={handleChange} onSubmit={handleSubmit} />
        </div>
        <PromptPreview generatedPrompt={generatedPrompt} />
        <button className="button" type="submit">
          Generate prompts
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
