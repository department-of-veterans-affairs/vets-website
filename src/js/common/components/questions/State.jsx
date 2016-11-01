import React from 'react';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import { isNotBlank } from '../../utils/validations';
import { states } from '../../utils/options-for-select';

/**
 * Select component for the US state of an address.
 *
 * No validation is provided since base UI elements provide all
 * common options as provided in reference PDF/JS form.
 */
class State extends React.Component {
  render() {
    return (
      <div>
        <ErrorableSelect required={this.props.required}
            errorMessage={isNotBlank(this.props.value) ? undefined : 'Please select a state'}
            label="State"
            options={states.USA}
            value={this.props.value}
            onValueChange={this.props.onUserInput}/>
      </div>
    );
  }
}

export default State;
