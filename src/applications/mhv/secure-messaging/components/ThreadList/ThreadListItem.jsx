import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { DefaultFolders, Categories, Paths } from '../../util/constants';
import { dateFormat } from '../../util/helpers';

const unreadMessageClassList = 'vads-u-margin-y--0p5 vads-u-font-weight--bold';
const readMessageClassList = 'vads-u-margin-y--0p5';
const attachmentClasses =
  'vads-u-margin-right--1 vads-u-font-size--sm fas fa-paperclip';

const ThreadListItem = props => {
  const location = useLocation();
  const { keyword, activeFolder } = props;
  const {
    senderName,
    sentDate,
    draftDate,
    subject,
    recipientName,
    hasAttachment,
    messageId,
    category,
    triageGroupName,
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

    return dateFormat(date, 'MMMM D, YYYY [at] h:mm a z');
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

  return (
    <div
      className="thread-list-item vads-l-row vads-u-padding-y--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-light"
      data-testid="thread-list-item"
    >
      <div className="unread-column vads-l-col">
        {activeFolder.folderId !== DefaultFolders.DRAFTS.id &&
          (unreadMessages && (
            <span>
              <i
                role="img"
                aria-label="Unread message"
                className="unread-icon vads-u-margin-right--1 vads-u-color--primary-darker fas fa-solid fa-circle"
                data-testid="thread-list-unread-icon"
                alt="Unread message icon"
              />
              <span className="sr-only">Unread message</span>
            </span>
          ))}
      </div>
      <div className="vads-l-col vads-u-margin-left--1">
        <div className={getClassNames()}>
          {location.pathname !== '/sent' ? (
            <>
              <span>
                {unsentDrafts && (
                  <>
                    <span className="thread-list-draft">(Draft)</span> -{' '}
                  </>
                )}
              </span>{' '}
              {unreadMessages ? (
                <span>
                  {getHighlightedText(senderName)} (Team: {triageGroupName})
                  <span className="sr-only">Unread message</span>
                </span>
              ) : (
                <>
                  {getHighlightedText(senderName)} (Team: {triageGroupName})
                </>
              )}
              <span />{' '}
              {messageCount > 1 && (
                <span className="message-count">({messageCount} messages)</span>
              )}
            </>
          ) : (
            <div>
              <div>
                To: {recipientName} (Team: {triageGroupName}){' '}
              </div>{' '}
              {messageCount > 1 && (
                <span className="message-count">({messageCount} messages)</span>
              )}
            </div>
          )}
        </div>
        <Link
          aria-label={`${
            unreadMessages ? 'Unread message.' : ''
          } Message subject: ${categoryLabel}: ${subject}, ${formattedDate()}. ${
            hasAttachment ? ' Has attachment.' : ''
          }`}
          className="message-subject-link vads-u-margin-y--0p5"
          to={`${Paths.MESSAGE_THREAD}${messageId}/`}
        >
          {hasAttachment ? (
            <span id={`message-link-has-attachment-${messageId}`}>
              {categoryLabel}: {getHighlightedText(subject)}
              <span className="sr-only">Has attachment</span>
            </span>
          ) : (
            <span id={`message-link-${messageId}`}>
              {categoryLabel}: {getHighlightedText(subject)}
            </span>
          )}
        </Link>

        <p className="received-date vads-u-margin-y--0p5">
          {hasAttachment && (
            <i
              role="img"
              aria-labelledby={`message-link-has-attachment-${messageId}`}
              className={attachmentClasses}
              alt="Attachment icon"
            />
          )}
          <span>{formattedDate()}</span>
        </p>
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
