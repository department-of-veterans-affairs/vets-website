import React from 'react';

import ErrorableInput from './_form_elements/ErrorableInput';
import { isValidSSN } from '../_utils/validations.js';

/**
 * Input component for collecting a Social Security Number.
 *
 * Validates the input data. Does NOT consider "invalid" ssn such as
 * 000-00-0000 to be errors. This is to allow integration testing with fake
 * data.
 */
class SocialSecurityNumber extends React.Component {
  render() {
    const errorMessage = isValidSSN(this.props.ssn) ? undefined : 'Please put your number in this format xxx-xx-xxxx';
    return (
      <div>
        <ErrorableInput
            errorMessage={errorMessage}
            label="Social Security Number"
            placeholder="xxx-xx-xxxx"
            questionValue={this.props.ssn}
            onValueChange={this.props.onValueChange}/>
      </div>
    );
  }
}

SocialSecurityNumber.propTypes = {
  required: React.PropTypes.bool,
  value: React.PropTypes.string,
  onValueChange: React.PropTypes.func,
};


export default SocialSecurityNumber;
