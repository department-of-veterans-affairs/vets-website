import PropTypes from 'prop-types';
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

  validateRequiredFields(field, isRequired, customValidation) {
    if (customValidation) {
      return validateIfDirty(field, customValidation);
    } else if (isRequired) {
      return validateIfDirty(field, isValidName);
    }
    return validateIfDirty(field, isBlank) || validateIfDirty(field, isValidName);
  }

  render() {
    const errorMessage = this.props.customErrorMessage ? this.props.customErrorMessage : 'Please enter a valid name';

    return (
      <div>
        <ErrorableTextInput
          errorMessage={this.validateRequiredFields(this.props.name.first, this.props.required) ? undefined : errorMessage}
          label="First name"
          name="fname"
          autocomplete="given-name"
          charMax={30}
          required={this.props.required}
          field={this.props.name.first}
          onValueChange={(update) => {this.handleChange('first', update);}}/>

        <ErrorableTextInput
          errorMessage={this.validateRequiredFields(this.props.name.middle, false) ? undefined : errorMessage}
          label="Middle name"
          name="mname"
          autocomplete="additional-name"
          charMax={30}
          field={this.props.name.middle}
          onValueChange={(update) => {this.handleChange('middle', update);}}/>

        <ErrorableTextInput
          errorMessage={this.validateRequiredFields(this.props.name.last, this.props.required, this.props.customValidation) ? undefined : errorMessage}
          label="Last name"
          name="lname"
          autocomplete="family-name"
          charMax={30}
          required={this.props.required}
          field={this.props.name.last}
          onValueChange={(update) => {this.handleChange('last', update);}}/>

        <ErrorableSelect
          autocomplete="false"
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
  required: PropTypes.bool,
  name: PropTypes.shape({
    first: PropTypes.shape({
      value: PropTypes.string,
      dirty: PropTypes.bool,
    }),
    middle: PropTypes.shape({
      value: PropTypes.string,
      dirty: PropTypes.bool,
    }),
    last: PropTypes.shape({
      value: PropTypes.string,
      dirty: PropTypes.bool,
    }),
    suffix: PropTypes.shape({
      value: PropTypes.string,
      dirty: PropTypes.bool,
    }),
  }).isRequired,
  customValidation: PropTypes.func,
  customErrorMessage: PropTypes.string,
  onUserInput: PropTypes.func.isRequired,
};

export default FullName;
