import React from 'react';

class MessageAddAttachment extends React.Component {
  render() {
    let mimeTypes = '*';

    if (this.props.allowedMimeTypes) {
      mimeTypes = this.props.allowedMimeTypes.join(',');
    }

    return (
      <div className={this.props.cssClass}>
        <label htmlFor={this.props.id}>
          <i className="fa fa-paperclip"></i>
          <span>{this.props.label}</span>
        </label>
        <input
            multiple
            accept={mimeTypes}
            id={this.props.id}
            name={this.props.name}
            onChange={this.props.onChange}
            type="file"/>
      </div>
    );
  }
}

MessageAddAttachment.propTypes = {
  cssClass: React.PropTypes.string,
  allowedMimeTypes: React.PropTypes.arrayOf(React.PropTypes.string),
  id: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func
};

export default MessageAddAttachment;
