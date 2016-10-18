import React from 'react';
import _ from 'lodash';

class FileInput extends React.Component {
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
    return (
      <div className={this.props.additionalClass}>
        <label htmlFor={this.inputId} className="usa-button usa-button-outline">{this.props.buttonText}</label>
        <input
            multiple={this.props.multiple}
            style={{ display: 'none' }}
            type="file"
            accept={this.props.mimeTypes}
            id={this.inputId}
            name={this.props.name}
            onChange={this.handleChange}/>
      </div>
    );
  }
}

FileInput.propTypes = {
  multiple: React.PropTypes.bool,
  buttonText: React.PropTypes.string,
  additionalClass: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  mimeTypes: React.PropTypes.string,
  name: React.PropTypes.string.isRequired
};

FileInput.defaultProps = {
  buttonText: 'Add Files',
  mimeTypes: '',
  multiple: false
};

export default FileInput;
