// Description: ComboBox component for the disability benefits form.
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

export class ComboBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // bump: false,
      // searchTerm: '',
      // value: value || '',
      input: '',
    };
    //     //this.inputRef = React.createRef();
  }

  handleSearchChange = e => {
    // const { bump } = this.state;
    // const updatedTerm = e.target.value;
    const newTextValue = e.target.value;
    this.setState({
      // searchTerm: updatedTerm,
      // bump: !bump,
      input: newTextValue,
    });
    this.props.onChange(newTextValue);
  };

  render() {
    // const { searchTerm } = this.state;
    return (
      <div className="autosuggest-container">
        <VaTextInput
          hint={null}
          label="What new condition do you want to claim?"
          message-aria-describedby="What new condition do you want to claim?"
          name="combobox-input"
          onInput={this.handleSearchChange}
          onChange={this.handleSearchChange}
        />
      </div>
    );
  }
}
