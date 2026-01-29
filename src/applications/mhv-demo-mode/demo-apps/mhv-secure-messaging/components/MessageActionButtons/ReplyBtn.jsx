import React from 'react';
import PropTypes from 'prop-types';

const ReplyBtn = props => {
  return (
    props.visible && (
      <li>
        <button
          type="button"
          className="usa-button-secondary vads-u-display--flex vads-u-flex-direction--row vads-u-justify-content--center vads-u-align-items--center"
          data-testid="reply-button-top"
          onClick={props.onReply}
        >
          <div className="vads-u-margin-right--0p5">
            <va-icon icon="undo" aria-hidden="true" />
          </div>
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
