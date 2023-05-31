import React from 'react';

const PromptForm = () => {
  return (
    <div>
      <form className="w-full">
        <label className="block mb-2" htmlFor="prompt">
          Prompt template
        </label>
        <div className="flex">
          <textarea
            id="prompt"
            type="text"
            rows="3"
            className="flex-grow border-2 border-gray-600 rounded-md p-2"
            name="prompt"
          />
        </div>
        <button className="button" type="submit">
          Generate
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
