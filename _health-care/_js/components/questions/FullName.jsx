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
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  // TODO: look into why this is updating so slowly
  handleChange(path, update) {
    const name = {
      first: this.props.name.first,
      middle: this.props.name.middle,
      last: this.props.name.last,
      suffix: this.props.name.suffix
    };

    name[path] = update;

    this.props.onUserInput(name);
  }

  validateRequiredFields(field, isRequired) {
    if (isRequired) {
      return !field.dirty || isValidName(field.value);
    }
    return isBlank(field.value) || isValidName(field.value);
  }

  render() {
    return (
      <div>
        <ErrorableTextInput
            errorMessage={this.validateRequiredFields(this.props.name.first, this.props.required) ? undefined : 'Please enter a valid name'}
            label="First Name"
            required={this.props.required}
            field={this.props.name.first}
            onValueChange={(update) => {this.handleChange('first', update);}}/>

        <ErrorableTextInput
            errorMessage={this.validateRequiredFields(this.props.name.middle, false) ? undefined : 'Please enter a valid name'}
            label="Middle Name"
            field={this.props.name.middle}
            onValueChange={(update) => {this.handleChange('middle', update);}}/>

        <ErrorableTextInput
            errorMessage={this.validateRequiredFields(this.props.name.last, this.props.required) ? undefined : 'Please enter a valid name'}
            label="Last Name"
            required={this.props.required}
            field={this.props.name.last}
            onValueChange={(update) => {this.handleChange('last', update);}}/>

        <ErrorableSelect
            label="Suffix"
            options={suffixes}
            value={this.props.name.suffix}
            onValueChange={(update) => {this.handleChange('suffix', update);}}/>
      </div>
    );
  }
}

FullName.propTypes = {
  required: React.PropTypes.bool,
  name: React.PropTypes.shape({
    first: React.PropTypes.string,
    middle: React.PropTypes.string,
    last: React.PropTypes.string,
    suffix: React.PropTypes.string,
  }).isRequired,
  onUserInput: React.PropTypes.func.isRequired,
};

export default FullName;
