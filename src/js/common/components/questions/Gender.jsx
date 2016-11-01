import React from 'react';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import { genders } from '../../utils/options-for-select';
import { validateIfDirty, isNotBlank } from '../../utils/validations';

/**
 * Select component for gender.
 *
 * No validation is provided since base UI elements provide all
 * common options as provided in reference PDF/JS form.
 */
class Gender extends React.Component {
  render() {
    let isValid;

    if (this.props.required) {
      isValid = validateIfDirty(this.props.value, isNotBlank);
    } else {
      isValid = true;
    }

    return (
      <div>
        <ErrorableSelect required={this.props.required}
            errorMessage={isValid ? undefined : 'Please select a gender'}
            label="Gender"
            name="gender"
            options={genders}
            value={this.props.value}
            onValueChange={this.props.onUserInput}/>
      </div>
    );
  }
}

Gender.propTypes = {
  required: React.PropTypes.bool,
  value: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool,
  }).isRequired,
  onUserInput: React.PropTypes.func.isRequired,
};

export default Gender;
