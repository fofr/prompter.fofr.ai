import React, { Component } from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import autocompleteLists from "prompt-lists/lists.json"

autocompleteLists.push("random");
autocompleteLists.sort();

const Item = ({ entity }) => <div>{`${entity}`}</div>;

class PromptAutocomplete extends Component {
  handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.props.handleChange(e);
    }
  }

  render() {
    return (
      <ReactTextareaAutocomplete
        onKeyDown={this.handleKeyDown}
        onChange={this.props.handleChange}
        id="prompt"
        type="text"
        rows="5"
        spellCheck="false"
        value={this.props.value}
        className="flex-grow border-2 border-gray-600 p-4"
        name="prompt"
        loadingComponent={() => <span></span>}
        ref={rta => {
          this.rta = rta;
        }}
        innerRef={textarea => {
          this.textarea = textarea;
        }}
        minChar={0}
        trigger={{
          "[": {
            dataProvider: token => {
              const filteredLists = token
                ? autocompleteLists.filter(list => list.toLowerCase().includes(token.toLowerCase()))
                : autocompleteLists;

              return filteredLists;
            },
            component: Item,
            output: (item, trigger) => {
              const selection = this.textarea.selectionStart;
              const value = this.textarea.value;
              const nextChar = value[selection];
              const text = nextChar === "]" ? `[${item}` : `[${item}]`;

              return {
                text,
                caretPosition: "end",
              }
            }
          }
        }}
      />
    );
  }
};

export default PromptAutocomplete;
