import React from 'react';
import MessageAttachmentsViewItem from './MessageAttachmentsViewItem';
import _ from 'lodash';

class MessageAttachmentsView extends React.Component {
  render() {
    const attachments = this.props.attachments.map((attachment) => {
      const key = _.uniqueId('msg-attachment-item-');

      return (
        <MessageAttachmentsViewItem
            key={key}
            name={attachment.attributes.name}
            url={attachment.links.download}/>
      );
    });

    return (
      <div className="msg-attachments-received">
        <h5 className="msg-attachments-received-title">Attachments:</h5>
        <ul className="msg-attachments-received-list">
          {attachments}
        </ul>
      </div>
    );
  }
}

// TODO: Correct this type as necessary
MessageAttachmentsView.propTypes = {
  attachments: React.PropTypes.array
};

export default MessageAttachmentsView;
