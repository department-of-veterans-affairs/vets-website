import React from 'react';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DefaultFolders, Categories, Paths } from '../../util/constants';
import { dateFormat } from '../../util/helpers';

const unreadMessageClassList = 'vads-u-font-weight--bold';
const readMessageClassList = '';
const attachmentClasses =
  'vads-u-margin-right--1 vads-u-font-size--sm fas fa-paperclip';

const ThreadListItem = props => {
  const mhvSecureMessagingToPhase1 = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingToPhase1],
  );

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

    return mhvSecureMessagingToPhase1
      ? dateFormat(date, 'MMMM D, YYYY')
      : dateFormat(date, 'MMMM D, YYYY [at] h:mm a z');
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

  return mhvSecureMessagingToPhase1 ? (
    <div
      className="thread-list-item vads-l-row vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--2 vads-u-border-bottom--1px vads-u-border-color--gray-light"
      data-testid="thread-list-item"
    >
      <div className="unread-column vads-l-col">
        {activeFolder.folderId !== DefaultFolders.DRAFTS.id &&
          (unreadMessages && (
            <span>
              <i
                role="img"
                aria-hidden="true"
                className="unread-icon vads-u-margin-right--1 vads-u-color--primary-darker fas fa-solid fa-circle"
                data-testid="thread-list-unread-icon"
                alt="Unread message icon"
              />
            </span>
          ))}
      </div>
      <div className="vads-l-col vads-u-margin-left--1">
        <Link
          aria-label={`${
            unreadMessages ? 'Unread message. Subject:' : 'Message subject:'
          } ${categoryLabel}: ${subject}, ${formattedDate()}. ${
            hasAttachment ? ' Has attachment.' : ''
          }`}
          className="message-subject-link vads-u-margin-y--0 vads-u-line-height--4 vads-u-font-size--lg"
          to={`${Paths.MESSAGE_THREAD}${messageId}/`}
          data-dd-privacy="mask"
        >
          {hasAttachment ? (
            <span
              id={`message-link-has-attachment-${messageId}`}
              className={`vads-u-font-size--lg ${
                unreadMessages ? 'vads-u-font-weight--bold' : ''
              }`}
            >
              {categoryLabel}: {getHighlightedText(subject)}
              <span className="sr-only">Has attachment</span>
            </span>
          ) : (
            <span
              id={`message-link-${messageId}`}
              className={`vads-u-font-size--lg ${
                unreadMessages ? 'vads-u-font-weight--bold' : ''
              }`}
            >
              {categoryLabel}: {getHighlightedText(subject)}
            </span>
          )}
        </Link>
        <div className={getClassNames()} data-dd-privacy="mask">
          {location.pathname !== Paths.SENT ? (
            <span>{getHighlightedText(senderName)}</span>
          ) : (
            <span>To: {recipientName}</span>
          )}
        </div>
        <div
          className="vads-u-font-weight--normal vads-u-color--gray-medium vads-u-margin-top--0p5"
          data-testid="received-date"
        >
          {formattedDate()}
        </div>
        <div data-testid="message-info-row">
          {hasAttachment && (
            <i
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
              <span className="vads-u-color--secondary-darkest">Draft</span>
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
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
        <div className={getClassNames()} data-dd-privacy="mask">
          {location.pathname !== Paths.SENT ? (
            <>
              <span>
                {unsentDrafts && (
                  <>
                    <span className="thread-list-draft">(Draft)</span> -{' '}
                  </>
                )}
              </span>{' '}
              {unreadMessages ? (
                <span data-testid="triageGroupName">
                  {getHighlightedText(senderName)} (Team: {triageGroupName})
                  <span className="sr-only">Unread message</span>
                </span>
              ) : (
                <span data-testid="triageGroupName">
                  {getHighlightedText(senderName)} (Team: {triageGroupName})
                </span>
              )}
              <span />{' '}
              {messageCount > 1 && (
                <span className="message-count" data-testid="message-count">
                  ({messageCount} messages)
                </span>
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
          data-dd-action-name="Link to Message Subject Details"
          aria-label={`${
            unreadMessages ? 'Unread message.' : ''
          } Message subject: ${categoryLabel}: ${subject}, ${formattedDate()}. ${
            hasAttachment ? ' Has attachment.' : ''
          }`}
          className="message-subject-link vads-u-margin-y--0p5"
          to={`${Paths.MESSAGE_THREAD}${messageId}/`}
          data-dd-privacy="mask"
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
          <span data-testid="thread-date" data-dd-privacy="mask">
            {formattedDate()}
          </span>
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
