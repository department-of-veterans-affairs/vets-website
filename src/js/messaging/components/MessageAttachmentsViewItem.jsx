import React from 'react';

import { authFetch } from '../utils/helpers';

class MessageAttachmentsViewItem extends React.Component {
  constructor(props) {
    super(props);
    this.downloadAttachment = this.downloadAttachment.bind(this);
  }

  downloadAttachment(event) {
    event.preventDefault();
    authFetch(this.props.url)
    .then(response => response.blob())
    .then(blob => {
      window.open(URL.createObjectURL(blob), '_blank');
    });
  }

  render() {
    return (
      <li>
        <a onClick={this.downloadAttachment} href={this.props.url} className="msg-attachment-item" download>
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
