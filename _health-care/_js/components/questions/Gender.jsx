import React from 'react';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import { genders } from '../../utils/options-for-select';
import { isNotBlank } from '../../utils/validations';

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
            errorMessage={isNotBlank(this.props.value) ? undefined : 'Please select a gender'}
            label="Gender"
            options={genders}
            value={this.props.value}
            onValueChange={this.props.onUserInput}/>
      </div>
    );
  }
}

Gender.propTypes = {
  required: React.PropTypes.bool,
  value: React.PropTypes.string.isRequired,
  onUserInput: React.PropTypes.func.isRequired,
};

export default Gender;
