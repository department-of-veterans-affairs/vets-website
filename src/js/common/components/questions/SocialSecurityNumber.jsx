import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { validateIfDirty, isBlank, isValidSSN } from '../../utils/validations.js';

/**
 * Input component for collecting a Social Security Number.
 *
 * Validates the input data. Does NOT consider "invalid" ssn such as
 * 000-00-0000 to be errors. This is to allow integration testing with fake
 * data.
 *
 * Props:
 * `label` - String. Optional, if provided overrides default label.
 * `required` - Boolean. Optional, defaults to true.
 * `ssn` - String. Value of SSN.
 * `onValueChange` - updates value of SSN
 */
class SocialSecurityNumber extends React.Component {
  constructor() {
    super();
    this.validate = this.validate.bind(this);
  }

  validate(field) {
    if (this.props.required) {
      return validateIfDirty(field, isValidSSN);
    }
    return isBlank(field.value) || validateIfDirty(field, isValidSSN);
  }

  render() {
    const errorMessage = this.validate(this.props.ssn) ? undefined : 'Please enter 9 digits with or without dashes (xxx-xx-xxxx)';
    return (
      <div>
        <ErrorableTextInput
            errorMessage={errorMessage}
            label={this.props.label || 'Social Security Number'}
            name="ssn"
            placeholder="xxx-xx-xxxx"
            required={this.props.required !== undefined ? this.props.required : true}
            field={this.props.ssn}
            onValueChange={this.props.onValueChange}/>
      </div>
    );
  }
}

SocialSecurityNumber.propTypes = {
  label: React.PropTypes.string,
  required: React.PropTypes.bool,
  ssn: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool,
  }).isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};


export default SocialSecurityNumber;
