import React from 'react';
import _ from 'lodash';

import ErrorableTextInput from '../../../common/components/form-elements/ErrorableTextInput';
import { isValidName, isBlank } from '../../../common/utils/validations';

class MothersMaidenName extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  handleChange(update) {
    this.props.onUserInput(update);
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
            errorMessage={this.validateRequiredFields(this.props.value, this.props.required) ? undefined : 'Please enter a valid name'}
            label="Mother’s maiden name"
            name="mothersMaidenName"
            field={this.props.value}
            onValueChange={(update) => {this.handleChange(update);}}/>
      </div>
    );
  }
}

export default MothersMaidenName;
