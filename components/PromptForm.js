import React from 'react';
import PromptAutocomplete from './PromptAutocomplete';

const PromptForm = () => {
  return (
    <div>
      <form className="w-full">
        <label className="block mb-2" htmlFor="prompt">
          Prompt template
        </label>
        <div className="flex">
          <PromptAutocomplete />
        </div>
        <button className="button" type="submit">
          Generate
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
