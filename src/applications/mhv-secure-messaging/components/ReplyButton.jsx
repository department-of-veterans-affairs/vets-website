import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Paths } from '../util/constants';
import useFeatureToggles from '../hooks/useFeatureToggles';

const ReplyButton = props => {
  const history = useHistory();
  const { customFoldersRedesignEnabled } = useFeatureToggles();
  const messageId = useSelector(
    state => state.sm.threadDetails.messages[0]?.messageId,
  );

  const handleReplyButton = useCallback(
    () => {
      history.push(`${Paths.REPLY}${messageId}/`);
    },
    [history, messageId],
  );

  return (
    props.visible &&
    (customFoldersRedesignEnabled ? (
      <Link
        className="compose-message-link vads-c-action-link--green vads-u-font-weight--bold vads-u-padding-left--5"
        to={`${Paths.REPLY}${messageId}/`}
        data-testid="reply-to-message-link"
        data-dd-action-name="Reply Link"
      >
        Reply
      </Link>
    ) : (
      <button
        type="button"
        className="usa-button
        vads-u-width--full
        reply-button-in-body
        vads-u-display--flex
        vads-u-flex-direction--row
        vads-u-justify-content--center
        vads-u-align-items--center
        vads-u-margin-bottom--1
        vads-u-margin-top--0
        vads-u-margin-x--0     
        mobile-lg:vads-u-margin-right--1
        mobile-lg:vads-u-margin-top--0
        tablet:vads-u-margin-y--0"
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
    ))
  );
};

ReplyButton.propTypes = {
  visible: PropTypes.bool,
  onReply: PropTypes.func,
};
export default ReplyButton;
