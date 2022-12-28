import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DefaultFolders } from '../../util/constants';
import { dateFormat } from '../../util/helpers';

const unreadMessageClassList = 'vads-u-margin-y--0p5 vads-u-font-weight--bold';
const readMessageClassList = 'vads-u-margin-left--3 vads-u-margin-y--0p5';
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
  } = props;
  const activeFolder = useSelector(state => state.sm.folders.folder);

  const getClassNames = () => {
    return readReceipt === false
      ? unreadMessageClassList
      : readMessageClassList;
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

  return (
    <div
      className="vads-u-padding-y--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-light"
      data-testid="message-list-item"
    >
      <div className={getClassNames()}>
        {readReceipt === false && (
          <i
            aria-hidden="true"
            className="unread-icon vads-u-margin-right--1 vads-u-color--primary-darker fas fa-solid fa-circle"
          />
        )}
        {location.pathname !== '/sent' && location.pathname !== '/drafts' ? (
          <span>Sender: {getHighlightedText(senderName)}</span>
        ) : (
          <div>
            <div>To: {recipientName}</div>
            <div>From: {senderName}</div>
          </div>
        )}
      </div>
      <Link
        className="vads-u-margin-left--3 vads-u-margin-y--0p5"
        to={`/${
          activeFolder?.folderId === DefaultFolders.DRAFTS.id
            ? 'draft'
            : 'message'
        }/${messageId}`}
      >
        {getHighlightedText(subject)}
      </Link>
      <p className="vads-u-margin-left--3 vads-u-margin-y--0p5">
        {attachment && <i className={attachmentClasses} />}
        {formattedDate}
      </p>
    </div>
  );
};

export default MessageListItem;

MessageListItem.propTypes = {
  attachment: PropTypes.any,
  attributes: PropTypes.object,
  keyword: PropTypes.any,
  messageId: PropTypes.number,
  readReceipt: PropTypes.any,
  recipientName: PropTypes.string,
  senderName: PropTypes.string,
  sentDate: PropTypes.string,
  subject: PropTypes.string,
};
