import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isValidSSN } from '../../utils/validations.js';

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
  render() {
    const errorMessage = isValidSSN(this.props.ssn) ? undefined : 'Please put your number in this format xxx-xx-xxxx';
    return (
      <div className="usa-input-grid usa-input-grid-medium">
        <ErrorableTextInput
            errorMessage={errorMessage}
            label={this.props.label || 'Social Security Number'}
            placeholder="xxx-xx-xxxx"
            required={this.props.required !== undefined ? this.props.required : true}
            value={this.props.ssn}
            onValueChange={this.props.onValueChange}/>
      </div>
    );
  }
}

SocialSecurityNumber.propTypes = {
  label: React.PropTypes.string,
  required: React.PropTypes.bool,
  ssn: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};


export default SocialSecurityNumber;
