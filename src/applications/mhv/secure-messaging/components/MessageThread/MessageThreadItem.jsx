import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadMeta from './MessageThreadMeta';
import MessageThreadBody from './MessageThreadBody';
import MessageThreadAttachments from './MessageThreadAttachments';
import { markMessageAsReadInThread } from '../../actions/messages';
import { dateFormat } from '../../util/helpers';

const MessageThreadItem = props => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const { message } = props;
  const isRead = message.readReceipt === 'READ';

  useEffect(
    () => {
      if (props.printView) {
        setIsExpanded(true);
      }
    },
    [props.printView],
  );

  const handleExpand = e => {
    // prevent messaage to expand/collapse when user is selecting text
    if (window.getSelection().toString().length === 0) {
      if (e.keyCode === 32) {
        e.preventDefault(); // prevent from scrolling to the footer
      }

      // expanding/collapsing on Enter or Space key press for accessibility
      if (
        (e.key === 'Enter' || e.key === ' ' || e.type === 'click') &&
        e.target.tagName !== 'a' // prevent from collapsing when user clicks on a link in the message
      ) {
        setIsExpanded(!isExpanded);
      }

      if (!isRead && !isExpanded) {
        dispatch(markMessageAsReadInThread(message.messageId));
      }
    }
  };

  const hasAttachments = useMemo(
    () => {
      return (
        message.attachment ||
        message.hasAttachments ||
        message.attachments?.length
      );
    },
    [message.attachment, message.hasAttachments, message.attachments],
  );

  const ariaLabel = useMemo(
    () => {
      return `${!isRead ? 'New' : ''} message ${
        hasAttachments ? 'with attachment' : ''
      } from ${message.senderName}, ${dateFormat(
        message.sentDate,
        'MMMM D, YYYY [at] h:mm a z',
      )}. Click to ${isExpanded ? 'Collapse message' : 'Expand message'}`;
    },
    [hasAttachments, isExpanded, isRead, message],
  );

  return (
    message && (
      <>
        <div className="older-message vads-u-padding-top--0p5 vads-u-padding-bottom--2 vads-u-display--flex vads-u-flex-direction--row">
          <div
            className="vads-u-flex--auto"
            role="img"
            aria-label={!isRead ? 'Unread message' : 'Previously read message'}
          >
            <i
              className="unread-icon fas fa-circle"
              aria-hidden
              style={{ visibility: isRead === true ? 'hidden' : '' }}
            />
          </div>

          <div
            className="vads-u-flex--fill "
            role="button"
            tabIndex={0}
            data-testid={`expand-message-button-${message.messageId}`}
            aria-expanded={isExpanded}
            aria-label={!isExpanded ? ariaLabel : ''}
            onClickCapture={e => {
              handleExpand(e);
            }}
            onKeyDown={e => {
              handleExpand(e);
            }}
          >
            <MessageThreadMeta
              expanded={isExpanded}
              message={message}
              isRead={isRead}
              hasAttachments={hasAttachments}
            />
            <MessageThreadBody expanded={isExpanded} text={message.body} />
            {isExpanded &&
              message.attachments?.length > 0 && (
                <MessageThreadAttachments
                  expanded={isExpanded}
                  // TODO check how backend can return attachments list
                  attachments={message.attachments}
                />
              )}
          </div>
        </div>
        <HorizontalRule />
      </>
    )
  );
};

MessageThreadItem.propTypes = {
  message: PropTypes.object,
  printView: PropTypes.bool,
};

export default MessageThreadItem;
