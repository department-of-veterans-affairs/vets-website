import React from 'react';
import _ from 'lodash';

class ErrorableFileInput extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('errorable-file-input-');
  }

  handleChange(domEvent) {
    this.props.onChange(domEvent.target.files);
  }

  render() {
    let errorSpan = '';
    let errorSpanId = undefined;
    let inputErrorClass = undefined;
    let labelErrorClass = undefined;

    if (this.props.errorMessage) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{this.props.errorMessage}</span>;
      inputErrorClass = 'usa-input-error';
      labelErrorClass = 'usa-input-error-label';
    }

    // Calculate required.
    let requiredSpan = undefined;
    if (this.props.required) {
      requiredSpan = <span className="form-required-span">*</span>;
    }

    return (
      <div className={this.props.additionalClass}>
        <div className={inputErrorClass}>
          <label
              className={labelErrorClass}
              htmlFor={this.inputId}>
                {this.props.label}
                {requiredSpan}
          </label>
          {errorSpan}
          <label htmlFor={this.inputId} className="usa-button usa-button-outline">{this.props.buttonText}</label>
          <input
              multiple={this.props.multiple}
              style={{ display: 'none' }}
              type="file"
              accept={this.props.accept}
              id={this.inputId}
              name={this.props.name}
              onChange={this.handleChange}/>
        </div>
      </div>
    );
  }
}

ErrorableFileInput.propTypes = {
  multiple: React.PropTypes.bool,
  buttonText: React.PropTypes.string,
  additionalClass: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  accept: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  errorMessage: React.PropTypes.string
};

ErrorableFileInput.defaultProps = {
  buttonText: 'Add Files',
  mimeTypes: '',
  multiple: false
};

export default ErrorableFileInput;
