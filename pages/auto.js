import React, { Component } from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import "@webscopeio/react-textarea-autocomplete/style.css";

const Item = ({ entity }) => <div>{`${entity}`}</div>;
const Loading = ({ data }) => <div>Loading</div>;

class App extends Component {
  render() {
    return (
      <div className="App">
        <ReactTextareaAutocomplete
          className="my-textarea"
          loadingComponent={Loading}
          style={{
            fontSize: "18px",
            lineHeight: "20px",
            padding: 5
          }}
          ref={rta => {
            this.rta = rta;
          }}
          innerRef={textarea => {
            this.textarea = textarea;
          }}
          containerStyle={{
            marginTop: 20,
            width: 400,
            height: 100,
            margin: "20px auto"
          }}
          minChar={0}
          trigger={{
            "[": {
              dataProvider: async token => {
                const response = await fetch(`/api/autocomplete?token=${encodeURIComponent(token)}`);
                const data = await response.json();

                console.log(data)

                // Assuming the API returns an array of items in the same format expected by the component and output functions
                // If the format is different, you may need to map the data to the expected format
                return data;
              },
              component: Item,
              output: (item, trigger) => `${trigger}${item}]`
            }
          }}
        />
      </div>
    );
  }
}

export default App;
