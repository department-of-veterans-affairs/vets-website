import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadMeta from './MessageThreadMeta';
import MessageThreadBody from './MessageThreadBody';
import MessageThreadAttachments from './MessageThreadAttachments';

const MessageThreadItem = props => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isRead = props.message.attributes.read_receipt;
  const handleExpand = e => {
    if (e.keyCode === 32) {
      e.preventDefault(); // prevent from scrolling to the footer
    }
    if (!e.shiftKey && e.key !== 'Tab') {
      // prevent from expanding/collapsing on Tab key press for accessibility
      setIsExpanded(!isExpanded);
      e.target.scrollIntoView();
    }
  };

  return (
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

        <div className="vads-u-flex--fill ">
          <div
            role="button"
            data-testid="expand-message-button"
            aria-expanded={isExpanded}
            tabIndex={0}
            onClick={e => {
              handleExpand(e);
            }}
            onKeyDown={e => {
              handleExpand(e);
            }}
          >
            <MessageThreadMeta expanded={isExpanded} message={props.message} />
            <MessageThreadBody
              expanded={isExpanded}
              text={props.message.attributes.body}
            />
          </div>

          {props.message.attributes.attachments && (
            <MessageThreadAttachments
              expanded={isExpanded}
              attachments={props.message.attributes.attachments}
            />
          )}
        </div>

        <div className="vads-u-flex--auto">
          <div
            role="button"
            tabIndex={0}
            aria-label={isExpanded ? 'Collapse message' : 'Expand message'}
            onClick={e => {
              handleExpand(e);
            }}
            onKeyDown={e => {
              handleExpand(e);
            }}
          >
            {isExpanded ? (
              <i
                className="fas fa-angle-up vads-u-margin--0p5"
                aria-hidden="true"
              />
            ) : (
              <i
                className="fas fa-angle-down vads-u-margin--0p5"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
      <HorizontalRule />
    </>
  );
};

MessageThreadItem.propTypes = {
  message: PropTypes.object,
};

export default MessageThreadItem;
