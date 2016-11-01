import React from 'react';
import _ from 'lodash';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import { validateIfDirty, isValidName, isBlank } from '../../utils/validations';
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
      return validateIfDirty(field, isValidName);
    }
    return validateIfDirty(field, isBlank) || validateIfDirty(field, isValidName);
  }

  render() {
    return (
      <div>
        <ErrorableTextInput
            errorMessage={this.validateRequiredFields(this.props.name.first, this.props.required) ? undefined : 'Please enter a valid name'}
            label="First name"
            name="fname"
            autocomplete="given-name"
            charMax={30}
            required={this.props.required}
            field={this.props.name.first}
            onValueChange={(update) => {this.handleChange('first', update);}}/>

        <ErrorableTextInput
            errorMessage={this.validateRequiredFields(this.props.name.middle, false) ? undefined : 'Please enter a valid name'}
            label="Middle name"
            name="mname"
            autocomplete="additional-name"
            charMax={30}
            field={this.props.name.middle}
            onValueChange={(update) => {this.handleChange('middle', update);}}/>

        <ErrorableTextInput
            errorMessage={this.validateRequiredFields(this.props.name.last, this.props.required) ? undefined : 'Please enter a valid name'}
            label="Last name"
            name="lname"
            autocomplete="family-name"
            charMax={30}
            required={this.props.required}
            field={this.props.name.last}
            onValueChange={(update) => {this.handleChange('last', update);}}/>

        <ErrorableSelect
            additionalClass="form-select-medium"
            label="Suffix"
            name="suffix"
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
    first: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool,
    }),
    middle: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool,
    }),
    last: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool,
    }),
    suffix: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool,
    }),
  }).isRequired,
  onUserInput: React.PropTypes.func.isRequired,
};

export default FullName;
