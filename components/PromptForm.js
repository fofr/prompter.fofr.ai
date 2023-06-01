import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import PromptAutocomplete from './PromptAutocomplete';

const PromptForm = () => {
  const [inputValue, setInputValue] = useState('');

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
      console.log(data);
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
          <PromptAutocomplete value={inputValue} onSubmit={handleSubmit} />
        </div>
        <button className="button" type="submit">
          Generate
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
