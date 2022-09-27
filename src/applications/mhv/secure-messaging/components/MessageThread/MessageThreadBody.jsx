import React from 'react';
import PropTypes from 'prop-types';

const MessageThreadBody = props => {
  return (
    <div
      className={
        props.expanded
          ? 'message-list-body-expanded vads-u-margin-bottom--2'
          : 'message-list-body-collapsed'
      }
    >
      <>
        <p>{props.text}</p>
      </>
    </div>
  );
};

MessageThreadBody.propTypes = {
  expanded: PropTypes.bool,
  text: PropTypes.string,
};

export default MessageThreadBody;
