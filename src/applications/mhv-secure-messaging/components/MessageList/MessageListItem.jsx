import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { DefaultFolders, Categories, Paths } from '../../util/constants';
import { dateFormat } from '../../util/helpers';

const unreadMessageClassList = 'vads-u-margin-y--0p5 vads-u-font-weight--bold';
const readMessageClassList = 'vads-u-margin-y--0p5';
const attachmentClasses = 'vads-u-margin-right--1 vads-u-font-size--sm';

const MessageListItem = props => {
  const location = useLocation();
  const { activeFolder, keyword, message } = props;

  const {
    senderName,
    sentDate,
    subject,
    readReceipt,
    recipientName,
    suggestedNameDisplay,
    attachment,
    messageId,
    category,
  } = message;

  const inSentOrDrafts =
    activeFolder.folderId === DefaultFolders.DRAFTS.id ||
    activeFolder.folderId === DefaultFolders.SENT.id;

  const getClassNames = () => {
    // messages in draft and sent folders have inconsistent readReceipt values
    // we need to mark all messages in draft and sent folders as read
    return inSentOrDrafts || readReceipt === 'READ'
      ? readMessageClassList
      : unreadMessageClassList;
  };

  const formattedDate = dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z');

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
      className="message-list-item vads-l-row vads-u-padding-y--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-light"
      data-testid="message-list-item"
    >
      <div className="unread-column vads-l-col">
        {!inSentOrDrafts &&
          (readReceipt !== 'READ' && (
            <span
              aria-label="Unread message"
              role="img"
              className="unread-icon vads-u-margin-right--1 unread-bubble"
              alt="Unread message icon"
              data-testid="unread-message-icon"
            />
          ))}
      </div>
      <div className="vads-l-col vads-u-margin-left--1">
        <div className={getClassNames()}>
          {location.pathname !== Paths.SENT &&
          location.pathname !== Paths.DRAFTS ? (
            <span data-dd-privacy="mask">
              From: {getHighlightedText(senderName)}
            </span>
          ) : (
            <div>
              <div
                data-dd-privacy="mask"
                data-dd-action-name="Message List Item Recipient and Sender Info"
              >
                {location.pathname === Paths.DRAFTS && (
                  <>
                    <span className="thread-list-draft">(Draft)</span> -{' '}
                  </>
                )}
                To: {suggestedNameDisplay || recipientName}
              </div>
              <div
                data-dd-privacy="mask"
                data-dd-action-name="Message List Item Sender Info"
              >
                From: {senderName}
              </div>
            </div>
          )}
        </div>
        <Link
          className="message-subject-link vads-u-margin-y--0p5"
          aria-label={`${categoryLabel}: ${getHighlightedText(
            subject,
          )}, ${formattedDate}`}
          to={`/thread/${messageId}`}
          data-dd-privacy="mask"
          data-dd-action-name="Link to Message Subject Details"
        >
          {categoryLabel}: {getHighlightedText(subject)}
        </Link>
        <p className="received-date vads-u-margin-y--0p5">
          {attachment && (
            <va-icon
              icon="attach-file"
              className={attachmentClasses}
              aria-hidden
            />
          )}
          <span data-dd-privacy="mask">{formattedDate}</span>
        </p>
      </div>
    </div>
  );
};

export default MessageListItem;

MessageListItem.propTypes = {
  activeFolder: PropTypes.object,
  keyword: PropTypes.any,
  message: PropTypes.object,
};
