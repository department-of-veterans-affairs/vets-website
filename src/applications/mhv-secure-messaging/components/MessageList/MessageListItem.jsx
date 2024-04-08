import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { DefaultFolders, Categories, Paths } from '../../util/constants';
import { dateFormat } from '../../util/helpers';

const unreadMessageClassList = 'vads-u-margin-y--0p5 vads-u-font-weight--bold';
const readMessageClassList = 'vads-u-margin-y--0p5';
const attachmentClasses =
  'vads-u-margin-right--1 vads-u-font-size--sm fas fa-paperclip';

const MessageListItem = props => {
  const location = useLocation();
  const {
    senderName,
    sentDate,
    subject,
    readReceipt,
    recipientName,
    attachment,
    messageId,
    keyword,
    category,
    activeFolder,
  } = props;
  // const activeFolder = useSelector(state => state.sm.folders.folder);

  const getClassNames = () => {
    // messages in draft folder have inconsistent readReceipt values
    // we need to mark all messages in draft folder as read
    return activeFolder.folderId === DefaultFolders.DRAFTS.id ||
      readReceipt === 'READ'
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
        {activeFolder.folderId !== DefaultFolders.DRAFTS.id &&
          (readReceipt !== 'READ' && (
            <i
              role="img"
              aria-label="Unread message"
              className="unread-icon vads-u-margin-right--1 vads-u-color--primary-darker fas fa-solid fa-circle"
              alt="Unread message icon"
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
              <div data-dd-privacy="mask">
                {location.pathname === Paths.DRAFTS && (
                  <>
                    <span className="thread-list-draft">(Draft)</span> -{' '}
                  </>
                )}
                To: {recipientName}
              </div>
              <div data-dd-privacy="mask">From: {senderName}</div>
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
          {attachment && <i className={attachmentClasses} aria-hidden />}
          <span data-dd-privacy="mask">{formattedDate}</span>
        </p>
      </div>
    </div>
  );
};

export default MessageListItem;

MessageListItem.propTypes = {
  activeFolder: PropTypes.object,
  attachment: PropTypes.any,
  attributes: PropTypes.object,
  category: PropTypes.string,
  keyword: PropTypes.any,
  messageId: PropTypes.number,
  readReceipt: PropTypes.any,
  recipientName: PropTypes.string,
  senderName: PropTypes.string,
  sentDate: PropTypes.string,
  subject: PropTypes.string,
};
