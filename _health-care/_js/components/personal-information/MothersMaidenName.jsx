import React from 'react';
import _ from 'lodash';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isValidName, isBlank } from '../../utils/validations';

class MothersMaidenName extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.validateRequiredFields = this.validateRequiredFields.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  handleChange(update) {
    this.props.onUserInput(update);
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
        <ErrorableTextInput
            errorMessage={this.validateRequiredFields(this.props.value) ? undefined : 'Please enter a valid name'}
            label="Mother’s Maiden Name"
            value={this.props.value}
            onValueChange={(update) => {this.handleChange(update);}}/>
      </div>
    );
  }
}

export default MothersMaidenName;
