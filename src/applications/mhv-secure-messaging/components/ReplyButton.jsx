import React from 'react';
import PropTypes from 'prop-types';

const ReplyButton = props => {
  return (
    props.visible && (
      <button
        type="button"
        className="usa-button vads-u-width--full reply-button-in-body vads-u-display--flex vads-u-flex-direction--row vads-u-justify-content--center vads-u-align-items--center"
        data-testid="reply-button-body"
        onClick={props.onReply}
      >
        <div className="vads-u-margin-right--0p5">
          <va-icon icon="undo" aria-hidden="true" />
        </div>
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
