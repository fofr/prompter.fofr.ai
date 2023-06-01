import React, { useState, useRef } from 'react';
import debounce from 'lodash.debounce';
import PromptAutocomplete from './PromptAutocomplete';
import PromptPreview from './PromptPreview';
import Prompts from './Prompts';

const PromptForm = () => {
  const [inputValue, setInputValue] = useState('');
  const [promptPreview, setPromptPreview] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState([]);

  const generate = (promptTemplate, count) => {
    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ promptTemplate, count })
    })
    .then((response) => response.json())
    .then((data) => {
      if (count) {
        setGeneratedPrompts(data)
      } else {
        setPromptPreview(data[0])
      }
    })
    .catch((error) => {
      console.error('Failed to generate:', error);
    });
  };

  const debouncedGenerate = useRef(debounce(generate, 500)).current;

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedGenerate(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generate(inputValue, 20);
  };

  return (
    <div>
      <form
        className="w-full"
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <div className="flex">
          <PromptAutocomplete value={inputValue} handleChange={handleChange} onSubmit={handleSubmit} />
        </div>
        <PromptPreview promptPreview={promptPreview} />
        <button className="button" type="submit">
          Generate 20 prompts
        </button>

        <Prompts generatedPrompts={generatedPrompts} />
      </form>
    </div>
  );
};

export default PromptForm;
