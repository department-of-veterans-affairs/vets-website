import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { DefaultFolders, Categories, Paths } from '../../util/constants';
import { dateFormat } from '../../util/helpers';

const unreadMessageClassList = 'vads-u-font-weight--bold';
const readMessageClassList = '';
const attachmentClasses = 'vads-u-margin-right--1 vads-u-font-size--sm';

const ThreadListItem = props => {
  const location = useLocation();
  const { keyword, activeFolder } = props;
  const {
    senderName,
    sentDate,
    draftDate,
    subject,
    recipientName,
    suggestedNameDisplay,
    hasAttachment,
    messageId,
    category,
    messageCount,
    unreadMessages,
    unsentDrafts,
  } = props.thread;

  const getClassNames = () => {
    // messages in draft folder have inconsistent readReceipt values
    // we need to mark all messages in draft folder as read
    return activeFolder.folderId === DefaultFolders.DRAFTS.id ||
      unreadMessages === true
      ? unreadMessageClassList
      : readMessageClassList;
  };

  const formattedDate = () => {
    let date;
    if (draftDate) {
      date = draftDate;
    } else {
      date = sentDate;
    }

    return dateFormat(date, 'MMMM D, YYYY');
  };

  const getHighlightedText = text => {
    if (!keyword) return text;
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <span>
        {' '}
        {parts.map((part, i) => {
          const highlight = part.toLowerCase() === keyword.toLowerCase();
          const partProps = highlight
            ? {
                'data-testid': 'highlighted-text',
                className: 'keyword-highlight',
              }
            : {};
          return (
            <span key={i} {...partProps}>
              {part}
            </span>
          );
        })}{' '}
      </span>
    );
  };

  const categoryLabel = Categories[category];
  const addressText =
    location.pathname === Paths.DRAFTS
      ? suggestedNameDisplay || recipientName
      : senderName;

  const ddTitle =
    location.pathname === Paths.DRAFTS || location.pathname === Paths.SENT
      ? 'Triage Group Name'
      : 'Clinician Name';

  return (
    <div
      className="thread-list-item vads-l-row vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light"
      data-testid="thread-list-item"
    >
      <div className="unread-column vads-l-col">
        {activeFolder.folderId !== DefaultFolders.DRAFTS.id &&
          (unreadMessages && (
            <span>
              <span
                aria-hidden="true"
                role="img"
                className="unread-icon vads-u-margin-right--1 unread-bubble"
                data-testid="thread-list-unread-icon"
              />
            </span>
          ))}
      </div>
      <div className="vads-l-col vads-u-margin-left--1">
        <Link
          aria-describedby={`received-message-date-${messageId}`}
          className="message-subject-link vads-u-margin-y--0 vads-u-line-height--4 vads-u-font-size--lg"
          to={`${Paths.MESSAGE_THREAD}${messageId}/`}
          data-dd-privacy="mask"
          data-dd-action-name="Link to Message Subject Details"
        >
          <span
            id={`message-link${
              hasAttachment ? '-has-attachment' : ''
            }-${messageId}`}
            className={`vads-u-font-size--lg ${
              unreadMessages ? 'vads-u-font-weight--bold' : ''
            }`}
          >
            {unreadMessages && <span className="sr-only">Unread message.</span>}
            {categoryLabel}: {getHighlightedText(subject)}
            {hasAttachment && <span className="sr-only">Has attachment.</span>}
          </span>
        </Link>
        <div className={getClassNames()} data-dd-privacy="mask">
          {location.pathname !== Paths.SENT ? (
            <span data-dd-privacy="mask" data-dd-action-name={ddTitle}>
              {getHighlightedText(addressText)}
            </span>
          ) : (
            <span
              data-dd-privacy="mask"
              data-dd-action-name="Triage Group Name"
            >
              To: {suggestedNameDisplay || recipientName}
            </span>
          )}
        </div>
        <div
          className="vads-u-font-weight--normal vads-u-color--gray-medium vads-u-margin-top--0p5"
          data-testid="received-date"
          id={`received-message-date-${messageId}`}
        >
          {formattedDate()}
        </div>
        <div data-testid="message-info-row">
          {hasAttachment && (
            <va-icon
              icon="attach_file"
              role="img"
              aria-labelledby={`message-link-has-attachment-${messageId}`}
              className={attachmentClasses}
              alt="Attachment icon"
            />
          )}
          {location.pathname !== Paths.DRAFTS ? (
            <span
              className="message-count vads-u-color--gray-medium"
              data-testid="message-count"
            >
              {messageCount} {messageCount > 1 ? 'messages' : 'message'}
            </span>
          ) : (
            ''
          )}
          {unsentDrafts && (
            <>
              {location.pathname !== Paths.DRAFTS &&
                messageCount > 0 && (
                  <span className="vads-u-color--gray-medium">, </span>
                )}
              <span className="vads-u-color--secondary-darkest">[Draft]</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadListItem;

ThreadListItem.propTypes = {
  activeFolder: PropTypes.object,
  keyword: PropTypes.any,
  thread: PropTypes.object,
};
