import React from 'react';
import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';
import { PreparerPhoneNumberDescription } from '../utils/helpers';
/*
 * Handles removing dashes, parentheses, and the letter `x` from phone numbers
 * by keeping the user input in local state and saving the transformed version
 * instead
 */
export default class PhoneNumberWidget extends React.Component {
  state = { val: this.props.value, firstUpdate: true };

  componentDidUpdate(prevProps) {
    if (this.state.firstUpdate && this.props.value !== prevProps.value) {
      this.handleChange(this.props.value);
    }
  }

  handleChange = val => {
    let stripped;
    if (val) {
      stripped = val.replace(/[^0-9]/g, '');
    }

    this.setState({ val, firstUpdate: false }, () => {
      this.props.onChange(stripped);
    });
  };

  render() {
    return (
      <>
        <TextWidget
          {...this.props}
          type="tel"
          autocomplete="tel"
          value={this.state.val}
          onChange={this.handleChange}
        />
        <div className="preparer-contact-details-additional-info">
          {PreparerPhoneNumberDescription}
        </div>
      </>
    );
  }
}
