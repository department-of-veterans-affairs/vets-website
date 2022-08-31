import React, { useState } from 'react';
import Message from './Message';

const OlderMessages = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedAll, setIsExpandedAll] = useState(false);

  const handleExpandOlder = e => {
    // prevent fromp expanding/collapsing on Tab key press for accessibility
    if (e.key !== 'Tab') {
      setIsExpanded(!isExpanded);
      if (isExpandedAll) {
        // if collapsing Older Messages, collapse all expanded messages below as well
        setIsExpandedAll(!isExpandedAll);
      }
    }
  };

  const handleExpandAll = e => {
    // prevent fromp expanding/collapsing on Tab key press for accessibility
    if (e.key !== 'Tab') {
      setIsExpandedAll(!isExpandedAll);
    }
  };

  return (
    <div className="older-messages">
      <div
        onClick={e => {
          handleExpandOlder(e);
        }}
        aria-expanded={isExpanded}
        aria-controls="message-list-expanded"
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          handleExpandOlder(e);
        }}
      >
        <span className="vads-u-font-weight--bold">
          Older messages in this conversation
          {isExpanded ? (
            <i className="fas fa-angle-up fa-lg" aria-hidden />
          ) : (
            <i className="fas fa-angle-down fa-lg" aria-hidden />
          )}
        </span>
      </div>

      {isExpanded && (
        <div id="message-list-expanded">
          <div className="vads-l-row vads-u-justify-content--flex-end">
            <span
              onClick={e => {
                handleExpandAll(e);
              }}
              aria-expanded={isExpanded}
              aria-controls="message-list-body-expanded"
              role="button"
              tabIndex={0}
              className="expand-all-messages-btn vads-u-display--flex vads-u-align-items--flex-start"
              onKeyDown={e => {
                handleExpandAll(e);
              }}
            >
              Expand All Messages
              {isExpandedAll ? (
                <i className="fas fa-angle-up" aria-hidden />
              ) : (
                <i className="fas fa-angle-down" aria-hidden />
              )}
            </span>
          </div>
          <Message expanded={isExpandedAll} />
        </div>
      )}
    </div>
  );
};

export default OlderMessages;
