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
    return (
      <div>
        <ErrorableSelect required={this.props.required}
            errorMessage={validateIfDirty(this.props.value, isNotBlank) ? undefined : 'Please select a gender'}
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
