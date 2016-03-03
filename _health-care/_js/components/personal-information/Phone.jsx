import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isValidPhone } from '../../utils/validations.js';

/**
 * Input component for collecting a Phone number.
 *
 * Validates the input data. Does NOT consider "invalid" phone such as
 * 000-000-0000 to be errors. This is to allow integration testing with fake
 * data.
 *
 * Props:
 * `label` - String. Not required as a prop, can be passed directly to
 *            ErrorableTextInput
 * `value` - String. Stores the phone number.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class Phone extends React.Component {
  render() {
    const errorMessage = isValidPhone(this.props.value) ? undefined : 'Please put your number in this format xxx-xxx-xxxx';
    return (
      <div className="usa-input-grid usa-input-grid-large">
        <ErrorableTextInput
            errorMessage={errorMessage}
            label={this.props.label}
            placeholder="xxx-xxx-xxxx"
            value={this.props.value}
            onValueChange={this.props.onValueChange}/>
      </div>
    );
  }
}

Phone.propTypes = {
  label: React.PropTypes.string,
  value: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};


export default Phone;
