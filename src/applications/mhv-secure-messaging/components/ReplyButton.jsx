import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Paths } from '../util/constants';

const ReplyButton = props => {
  const history = useHistory();
  const messageId = useSelector(
    state => state.sm.threadDetails.messages[0]?.messageId,
  );

  const handleReplyButton = useCallback(() => {
    history.push(`${Paths.REPLY}${messageId}/`);
  }, [history, messageId]);

  return (
    props.visible && (
      <button
        type="button"
        className="usa-button vads-u-width--full reply-button-in-body vads-u-display--flex vads-u-flex-direction--row vads-u-justify-content--center vads-u-align-items--center"
        data-testid="reply-button-body"
        onClick={handleReplyButton}
        data-dd-action-name="Reply Button"
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
