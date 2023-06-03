import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';
import PromptAutocomplete from './PromptAutocomplete';
import PromptPreview from './PromptPreview';
import Prompts from './Prompts';
import Share from './Share';

const PromptForm = () => {
  const [promptTemplate, setPromptTemplate] = useState('');
  const [promptPreview, setPromptPreview] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const router = useRouter();

  const getPromptById = async (id) => {
    const response = await fetch(`/api/${id}`);
    const data = await response.json();

    if (response.status !== 200) {
      handleEmptyStart();
      return;
    }

    if (data) {
      setPromptTemplate(data.prompt);
      debouncedGenerate(data.prompt);
    } else {
      handleEmptyStart();
    }
  };

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
    setPromptTemplate(value);
    debouncedGenerate(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generate(promptTemplate, 20);
  };

  const handleEmptyStart = () => {
    const value = 'A film still of [character.fantasy], [interaction.couple], [cinematic.keyword], [cinematic.coloring], [cinematic.effect], set in [time.year]';
    setPromptTemplate(value);
    debouncedGenerate(value);
  }

  const handlePageLoad = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    id ? getPromptById(id) : handleEmptyStart();
  };

  useEffect(() => {
    handlePageLoad();
  }, []);

  return (
    <div>
      <form
        className="w-full"
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <div className="flex">
          <PromptAutocomplete value={promptTemplate} handleChange={handleChange} />
        </div>
        <PromptPreview promptPreview={promptPreview} />
        <div className="flex text-center items-center mt-6">
          <button className="button mr-2 flex-1" type="submit">
            Generate lots
          </button>

          <Share promptTemplate={promptTemplate} />
        </div>

        <Prompts generatedPrompts={generatedPrompts} />
      </form>
    </div>
  );
};

export default PromptForm;
