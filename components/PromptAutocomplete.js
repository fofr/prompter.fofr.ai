import React, { Component } from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import "@webscopeio/react-textarea-autocomplete/style.css";

const Item = ({ entity }) => <div>{`${entity}`}</div>;
const Loading = ({ data }) => <div>Loading</div>;

class PromptAutocomplete extends Component {
  handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.props.onSubmit(e);
    }
  }

  render() {
    return (
      <ReactTextareaAutocomplete
        onKeyDown={this.handleKeyDown}
        onChange={this.props.handleChange}
        id="prompt"
        type="text"
        rows="3"
        className="flex-grow border-2 border-gray-600 rounded-md p-2"
        name="prompt"
        loadingComponent={Loading}
        ref={rta => {
          this.rta = rta;
        }}
        innerRef={textarea => {
          this.textarea = textarea;
        }}
        minChar={0}
        trigger={{
          "[": {
            dataProvider: async token => {
              const response = await fetch(`/api/autocomplete?token=${encodeURIComponent(token)}`);
              return await response.json();
            },
            component: Item,
            output: (item, trigger) => `${trigger}${item}]`
          }
        }}
      />
    );
  }
};

export default PromptAutocomplete;
