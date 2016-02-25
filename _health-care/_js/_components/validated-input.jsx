import React from 'react';
import _ from 'lodash';

import ErrorMessage from './error-message';

/**
 * An text input field that can regexp validate an input.
 *
 * Validation has the following props.
 * `pattern` - a regexp that will be used to validate the input.
 * `placeholder` - placeholder string for input field.
 * `errorMessage` - the error message to display on validation error.
 * `required` - boolean. When present, the field may not be blank.
 * `value` - string. Value of the input field.
 * `onChange` - a function with this prototype: (newValue, isValid)
 */
class ValidatedInput extends React.Component {
  propTypes: {
    errorMessage: React.PropTypes.string,
//    pattern: React.PropTypes.instanceOf(RegExp),
    placeholder: React.PropTypes.string,
    required: React.PropTypes.bool,
  }

  constructor() {
    super();
    this.state = { hasError: false };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('validated-input-');
  }

  handleInputChange() {
    const fieldValue = this.refs.textInput.value;

    if (!this.validate(fieldValue)) {
      this.setState({ hasError: true });
    } else {
      this.setState({ hasError: false });
    }

    this.props.onChange(this.state.hasError, fieldValue);
  }

  validate(fieldValue) {
    return ((!this.props.required || fieldValue) &&
        this.props.pattern.test(fieldValue));
  }

  render() {
    let errorMessage = '';
    let ariaDescribedBy = '';
    if (this.state.hasError) {
      ariaDescribedBy = `${this.inputId}-error-message`;
      errorMessage = <ErrorMessage message={this.props.errorMessage} id={ariaDescribedBy}/>;
    }
    return (
      <div>
        {errorMessage}
        <input
            aria-describedby={ariaDescribedBy}
            id={this.inputId}
            onChange={this.handleInputChange}
            placeholder={this.props.placeholder}
            ref={(c) => this._input = c}
            type="text"
            value={this.props.value}/>
      </div>
    );
  }
}

export default ValidatedInput;
