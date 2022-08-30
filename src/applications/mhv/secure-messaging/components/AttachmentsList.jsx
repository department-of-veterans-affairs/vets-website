import React from 'react';
import PropTypes from 'prop-types';

const AttachmentsList = props => {
  const { attachments } = props;

  return (
    <div>
      {' '}
      <ul className="attachments-list">
        {!!attachments.length &&
          attachments.map(attachment => (
            <li key={attachment.id}>
              <i className="fas fa-paperclip" />
              <div>
                {attachment.name} ({attachment.attachmentSize} KB)
                <button
                  type="button"
                  className="link-button remove-attachment-button"
                >
                  <i className="fas fa-times" />
                  Remove
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

AttachmentsList.propTypes = {
  attachments: PropTypes.array,
};

export default AttachmentsList;
