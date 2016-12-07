import React from 'react';

class MessageAttachmentsViewItem extends React.Component {
  render() {
    return (
      <li>
        <a href={this.props.url} className="msg-attachment-item" download>
          <i className="fa fa-paperclip msg-attachment-icon"></i>
          {this.props.name}
        </a>
      </li>
    );
  }
}

MessageAttachmentsViewItem.propTypes = {
  name: React.PropTypes.string,
  url: React.PropTypes.string
};

export default MessageAttachmentsViewItem;
