import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isBlank, isValidPhone } from '../../utils/validations.js';

/**
 * Input component for collecting a Phone number.
 *
 * Validates the input data. Does NOT consider "invalid" phone numbers such
 * as 000-000-0000 to be errors. This is to allow integration testing with
 * fake data.
 *
 * Props:
 * `label` - String. Not required as a prop, can be passed directly to
 *            ErrorableTextInput
 * `required` - Boolean. Render marker indicating field is required.
 * `value` - String. Stores the phone number.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class Phone extends React.Component {
  render() {
    let errorMessage;
    if (this.props.required) {
      errorMessage = isValidPhone(this.props.value.value) ? undefined : 'Please put your number in this format xxx-xxx-xxxx';
    } else {
      errorMessage = isBlank(this.props.value.value) || isValidPhone(this.props.value.value) ? undefined : 'Please put your number in this format xxx-xxx-xxxx';
    }

    return (
      <div>
        <ErrorableTextInput
            errorMessage={errorMessage}
            label={this.props.label}
            placeholder="xxx-xxx-xxxx"
            field={this.props.value}
            onValueChange={this.props.onValueChange}/>
      </div>
    );
  }
}

Phone.propTypes = {
  required: React.PropTypes.bool,
  label: React.PropTypes.string,
  value: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default Phone;
