import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isBlank, validateIfDirty, isValidEmail } from '../../utils/validations.js';

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
 * `additionalClass` - Extra attribute for use by CSS selector, specifically
 *                     by tests
 * `onValueChange` - a function with this prototype: (newValue)
 */
class Email extends React.Component {
  render() {
    let errorMessage = undefined;
    if (this.props.error !== undefined) {
      errorMessage = this.props.error;
    } else if (this.props.required) {
      errorMessage = validateIfDirty(this.props.email, isValidEmail) ? undefined : 'Please put your email in this format x@x.xxx';
    } else {
      errorMessage = isBlank(this.props.email.value) || validateIfDirty(this.props.email, isValidEmail) ? undefined : 'Please put your email in this format x@x.xxx';
    }

    return (
      <div>
        <ErrorableTextInput
            required={this.props.required}
            errorMessage={errorMessage}
            label={this.props.label}
            name={this.props.name}
            autocomplete="email"
            charMax={50}
            field={this.props.email}
            additionalClass={this.props.additionalClass}
            onValueChange={this.props.onValueChange}/>
      </div>
    );
  }
}

Email.propTypes = {
  error: React.PropTypes.string,
  label: React.PropTypes.string,
  email: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired,
  additionalClass: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired,
  required: React.PropTypes.bool,
  name: React.PropTypes.string
};

Email.defaultProps = {
  name: 'email'
};

export default Email;
