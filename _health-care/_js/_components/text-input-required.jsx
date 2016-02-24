import React from 'react';
import _ from 'lodash';

import ErrorMessage from './error-message';

/**
 * An text input to be included by any question component for a field that is not required.
 *
 * @constructor
 */
class TextInputRequired extends React.Component {
  constructor() {
    super();
    this.state = { hasError: false };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  handleInputChange() {
    const fieldValue = this.refs.textInput.value;

    if (!this.validate(fieldValue)) {
      this.setState({ hasError: true });
    } else {
      this.setState({ hasError: false });
    }

    this.props.passValueUp(fieldValue);
    this.props.passErrorUp(this.state.hasError);
  }

  validate(fieldValue) {
    // TODO: create basic validation for presence and include specific SSN
    // validation in the SSN component and pass down to TextInputRequired
    return fieldValue !== '' && /^\d{3}-\d{2}-\d{4}$/.test(fieldValue);
  }

  render() {
    let errorMessage = '';
    if (this.state.hasError) {
      errorMessage = <ErrorMessage message={this.props.errorMessage} idPrefix={this.id}/>;
    }
    return (
      <div>
        {errorMessage}
        <input id={`${this.id}_${this.props.question}`}
            onChange={this.handleInputChange}
            placeholder={this.props.placeholder}
            ref="textInput"
            type="text"
            value={this.props.questionValue}/>
      </div>
    );
  }
}

export default TextInputRequired;
