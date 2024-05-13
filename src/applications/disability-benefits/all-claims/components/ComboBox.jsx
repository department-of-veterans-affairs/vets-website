import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

// This is a combobox component that is used in the revisedAddDisabilities page.
// Originally, the addDisabilities page used the AutosuggestField component from the platform-forms-system package.
// A new component was created to make suggestions to the veteran more understandable when selecting a new condition to claim.
// Search functions for use with this component are located in:
// src/platform/forms-system/src/js/utilities/addDisabilitiesStringSearch.js
export class ComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    };
  }

  handleSearchChange = e => {
    const newTextValue = e.target.value;
    this.setState({
      input: newTextValue,
    });
    this.props.onChange(newTextValue);
  };

  render() {
    return (
      <div className="autosuggest-container">
        <VaTextInput
          hint={null}
          label=""
          message-aria-describedby="What new condition do you want to claim?"
          name="combobox-input"
          onInput={this.handleSearchChange}
          onChange={this.handleSearchChange}
        />
      </div>
    );
  }
}
