import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { DefaultFolders, Categories } from '../../util/constants';
import { dateFormat } from '../../util/helpers';

const unreadMessageClassList = 'vads-u-margin-y--0p5 vads-u-font-weight--bold';
const readMessageClassList = 'vads-u-margin-y--0p5';
const attachmentClasses =
  'vads-u-margin-right--1 vads-u-font-size--sm fas fa-paperclip';

const ThreadListItem = props => {
  const location = useLocation();
  const {
    senderName,
    sentDate,
    draftDate,
    subject,
    readReceipt,
    recipientName,
    attachment,
    messageId,
    keyword,
    category,
    activeFolder,
    triageGroupName,
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
      className="message-list-item vads-l-row vads-u-padding-y--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-light"
      data-testid="message-list-item"
    >
      <div className="unread-column vads-l-col">
        {/* {activeFolder.folderId !== DefaultFolders.DRAFTS.id &&
          (readReceipt !== 'READ' && (
            <i
              aria-hidden="true"
              className="unread-icon vads-u-margin-right--1 vads-u-color--primary-darker fas fa-solid fa-circle"
            />
          ))} */}
      </div>
      <div className="vads-l-col vads-u-margin-left--1">
        <div className={getClassNames()}>
          {location.pathname !== '/sent' && location.pathname !== '/drafts' ? (
            <span>From: {getHighlightedText(senderName)}</span>
          ) : (
            <div>
              <div>To: {recipientName}</div>
              <div>From: {senderName}</div>
            </div>
          )}
        </div>
        <div>Triage Group: {triageGroupName}</div>
        <Link
          className="message-subject-link vads-u-margin-y--0p5"
          to={`/${
            activeFolder?.folderId === DefaultFolders.DRAFTS.id
              ? 'draft'
              : 'thread'
          }/${messageId}`}
        >
          {categoryLabel}: {getHighlightedText(subject)}
        </Link>
        <p className="received-date vads-u-margin-y--0p5">
          {attachment && <i className={attachmentClasses} aria-hidden />}
          <span>{formattedDate()}</span>
        </p>
      </div>
    </div>
  );
};

export default ThreadListItem;

ThreadListItem.propTypes = {
  activeFolder: PropTypes.object,
  attachment: PropTypes.any,
  attributes: PropTypes.object,
  category: PropTypes.string,
  draftDate: PropTypes.string,
  keyword: PropTypes.any,
  messageId: PropTypes.number,
  readReceipt: PropTypes.any,
  recipientName: PropTypes.string,
  senderName: PropTypes.string,
  sentDate: PropTypes.string,
  subject: PropTypes.string,
  triageGroupName: PropTypes.string,
};
