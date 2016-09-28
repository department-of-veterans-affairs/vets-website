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
            name={this.props.name}
            type="file"
            id={this.props.id}
            accept={mimeTypes}/>
      </div>
    );
  }
}

MessageAddAttachment.propTypes = {
  cssClass: React.PropTypes.string,
  allowedMimeTypes: React.PropTypes.arrayOf(React.PropTypes.string),
  name: React.PropTypes.string,
  id: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
};

export default MessageAddAttachment;
