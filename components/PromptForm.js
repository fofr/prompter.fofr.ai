import React, { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import PromptAutocomplete from './PromptAutocomplete';
import PromptPreview from './PromptPreview';
import Prompts from './Prompts';
import ShareModal from './ShareModal';

const PromptForm = () => {
  const [inputValue, setInputValue] = useState('');
  const [promptPreview, setPromptPreview] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const share = (promptTemplate) => {
    fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ promptTemplate })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Failed to share:', error);
    });
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
    setInputValue(value);
    debouncedGenerate(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generate(inputValue, 20);
  };

  const handleShare = (e) => {
    e.preventDefault();
    //share(inputValue);
    setIsModalOpen(true);
  };

  const handlePageLoad = () => {
    const value = 'A film still of [character.fantasy], [interaction.couple], [cinematic.keyword], [cinematic.coloring], [cinematic.effect], set in [time.year]';
    setInputValue(value);
    debouncedGenerate(value);
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
          <PromptAutocomplete value={inputValue} handleChange={handleChange} />
        </div>
        <PromptPreview promptPreview={promptPreview} />
        <div className="flex items-center">
          <button className="button mr-2" type="submit">
            Generate lots
          </button>

          <button className="button button--secondary ml-4" onClick={handleShare}>
            Share prompt
          </button>
        </div>

        <Prompts generatedPrompts={generatedPrompts} />
        <ShareModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </form>
    </div>
  );
};

export default PromptForm;
