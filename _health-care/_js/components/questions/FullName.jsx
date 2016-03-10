import React from 'react';
import _ from 'lodash';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import { isValidName, isBlank } from '../../utils/validations';
import { suffixes } from '../../utils/options-for-select';

/**
 * A form input with a label that can display error messages.
 *
 * Props:
 * `required` - boolean. Render marker indicating field is required.
 * `value` - object. Value of the full name.
 * `onUserInput` - a function with this prototype: (newValue)
 */

class FullName extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.validateRequiredFields = this.validateRequiredFields.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  // TODO: look into why this is updating so slowly
  handleChange(path, update) {
    const name = {
      first: this.props.value.first,
      middle: this.props.value.middle,
      last: this.props.value.last,
      suffix: this.props.value.suffix
    };

    name[path] = update;

    this.props.onUserInput(name);
  }

  validateRequiredFields(value) {
    if (this.props.required) {
      return isValidName(value);
    }
    return isBlank(value) || isValidName(value);
  }

  render() {
    return (
      <div>
        <div>
          <ErrorableTextInput
              errorMessage={this.validateRequiredFields(this.props.value.first) ? undefined : 'Please enter a valid name'}
              label="First Name"
              required={this.props.required}
              value={this.props.value.first}
              onValueChange={(update) => {this.handleChange('first', update);}}/>
        </div>

        <div>
          <ErrorableTextInput
              errorMessage={isBlank(this.props.value.middle) || isValidName(this.props.value.middle) ? undefined : 'Please enter a valid name'}
              label="Middle Name"
              value={this.props.value.middle}
              onValueChange={(update) => {this.handleChange('middle', update);}}/>
        </div>

        <div>
          <ErrorableTextInput
              errorMessage={this.validateRequiredFields(this.props.value.last) ? undefined : 'Please enter a valid name'}
              label="Last Name"
              required={this.props.required}
              value={this.props.value.last}
              onValueChange={(update) => {this.handleChange('last', update);}}/>
        </div>

        <div className="usa-input-grid usa-input-grid-small">
          <ErrorableSelect
              label="Suffix"
              options={suffixes}
              value={this.props.value.suffix}
              onValueChange={(update) => {this.handleChange('suffix', update);}}/>
        </div>
      </div>
    );
  }
}

FullName.propTypes = {
  required: React.PropTypes.bool,
  value: React.PropTypes.shape({
    first: React.PropTypes.string,
    middle: React.PropTypes.string,
    last: React.PropTypes.string,
    suffix: React.PropTypes.string,
  }).isRequired,
  onUserInput: React.PropTypes.func.isRequired,
};

export default FullName;
