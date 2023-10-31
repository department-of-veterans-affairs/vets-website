import React from 'react';
import PropTypes from 'prop-types';

const ReplyButton = props => {
  return (
    props.visible && (
      <button
        type="button"
        className="usa-button reply-button-in-body vads-u-width--full small-screen:vads-l-col--4 small-desktop-screen:vads-l-col--4 medium-screen:vads-l-col--4 large-screen:vads-l-col--4"
        data-testid="reply-button-body"
        onClick={props.onReply}
      >
        <i
          className="fas fa-reply vads-u-margin-right--0p5"
          aria-hidden="true"
        />
        <span
          className="message-action-button-text"
          data-testid="reply-button-body-text"
        >
          Reply
        </span>
      </button>
    )
  );
};

ReplyButton.propTypes = {
  visible: PropTypes.bool,
  onReply: PropTypes.func,
};
export default ReplyButton;
