import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isValidEmail } from '../../utils/validations.js';

/**
 * Input component for collecting a Email number.
 *
 * Validates the input data. Does NOT consider "invalid" email numbers such
 * as 000-000-0000 to be errors. This is to allow integration testing with
 * fake data.
 *
 * Props:
 * `error` - String. If set, it is rendered as the error for the input field.
 * `label` - String.
 * `value` - String. Stores the email address.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class Email extends React.Component {
  render() {
    let errorMessage = undefined;
    if (this.props.error !== undefined) {
      errorMessage = this.props.error;
    } else {
      errorMessage = isValidEmail(this.props.value) ? undefined : 'Please put your email in this format x@x.xxx';
    }
    return (
      <div>
        <ErrorableTextInput
            errorMessage={errorMessage}
            label={this.props.label}
            placeholder="x@x.xxx"
            value={this.props.value}
            onValueChange={this.props.onValueChange}/>
      </div>
    );
  }
}

Email.propTypes = {
  error: React.PropTypes.string,
  label: React.PropTypes.string,
  value: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default Email;
