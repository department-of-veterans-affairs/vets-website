import React from 'react';
import _ from 'lodash';

/**
 * A checkbox group with a label.
 *
 * Validation has the following props.

 * `label` - String for the group field label.
 * `required` - is this field required.
 */
class ErrorableGroup extends React.Component {
  componentWillMount() {
    this.inputId = _.uniqueId('errorable-group-');
  }

  render() {
    const hasError = this.props.required && this.props.errorMessage && !this.props.validation && this.props.isDirty;

    let errorSpan = '';
    let errorSpanId = undefined;
    if (hasError) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{this.props.errorMessage}</span>;
    }

    // Calculate required.
    let requiredSpan = undefined;
    if (this.props.required) {
      requiredSpan = <span className="form-required-span">*</span>;
    }

    return (
      <div className="form-errorable-group">
        <div className={hasError ? 'usa-input-error' : ''}>
          <label
              className={hasError ? 'usa-input-error-label' : undefined}>
              {this.props.label}
              {requiredSpan}
          </label>
          {errorSpan}
          {this.props.children}
        </div>
      </div>
    );
  }
}

ErrorableGroup.propTypes = {
  errorMessage: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  validation: React.PropTypes.bool,
  required: React.PropTypes.bool,
  isDirty: React.PropTypes.bool
};

export default ErrorableGroup;
