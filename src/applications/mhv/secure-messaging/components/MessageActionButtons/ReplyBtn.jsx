import React from 'react';
import PropTypes from 'prop-types';

const ReplyBtn = props => {
  return (
    props.visible && (
      <li>
        <button
          type="button"
          className="usa-button-secondary"
          data-testid="reply-button-top"
          onClick={props.onReply}
        >
          <i
            className="fas fa-reply vads-u-margin-right--0p5"
            aria-hidden="true"
          />
          <span
            className="message-action-button-text"
            data-testid="reply-button-text"
          >
            Reply
          </span>
        </button>
      </li>
    )
  );
};

ReplyBtn.propTypes = {
  visible: PropTypes.bool,
  onReply: PropTypes.func,
};
export default ReplyBtn;
