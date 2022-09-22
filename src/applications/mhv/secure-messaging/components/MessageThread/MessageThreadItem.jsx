import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HorizontalRule from '../shared/HorizontalRule';
import MessageThreadMeta from './MessageThreadMeta';
import MessageThreadBody from './MessageThreadBody';
import MessageThreadAttachments from './MessageThreadAttachments';

const MessageThreadItem = props => {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = e => {
    // prevent fromp expanding/collapsing on Tab key press for accessibility
    if (e.key !== 'Tab') {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      <div className="older-message vads-u-padding-top--0p5 vads-u-padding-bottom--2 vads-u-display--flex vads-u-flex-direction--row">
        <div className="vads-u-flex--auto">
          <i
            className="unread-icon fas fa-circle"
            aria-hidden
            style={{
              visibility:
                props.message.attributes.read_receipt === true ? 'hidden' : '',
            }}
          />
        </div>
        <div className="vads-u-flex--fill ">
          <div
            role="button"
            data-testid="expand-message-button"
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

          <MessageThreadAttachments
            expanded={isExpanded}
            attachments={props.message.attributes.attachments}
          />
        </div>
        <div className="vads-u-flex--auto">
          <div
            role="button"
            tabIndex={0}
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
