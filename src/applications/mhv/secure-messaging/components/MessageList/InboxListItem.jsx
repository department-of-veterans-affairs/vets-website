/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

const unreadMessageClassList = 'vads-u-margin-y--0p5 vads-u-font-weight--bold';
const readMessageClassList = 'vads-u-margin-left--3 vads-u-margin-y--0p5';
const attachmentClasses =
  'vads-u-margin-right--1 vads-u-font-size--sm fas fa-paperclip';

const InboxListItem = props => {
  const {
    attributes: { sender_name, sent_date, subject, read_receipt, attachment },
    link: { self },
  } = props;

  const getClassNames = () => {
    return !!read_receipt === false
      ? unreadMessageClassList
      : readMessageClassList;
  };

  const formattedDate = format(
    new Date(sent_date),
    "MMMM d, yyyy 'at' h:mm aaaa",
  );

  return (
    <div className="vads-u-padding-y--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-light">
      <p className={getClassNames()}>
        {!!read_receipt === false && (
          <i
            aria-hidden="true"
            className="unread-icon vads-u-margin-right--1 vads-u-color--primary-darker fas fa-solid fa-circle"
          />
        )}
        {sender_name}
      </p>
      <a className="vads-u-margin-left--3 vads-u-margin-y--0p5" href={self}>
        {subject}
      </a>
      <p className="vads-u-margin-left--3 vads-u-margin-y--0p5">
        {attachment && <i className={attachmentClasses} />}
        {formattedDate}
      </p>
    </div>
  );
};

export default InboxListItem;

InboxListItem.propTypes = {
  attributes: PropTypes.object,
  link: PropTypes.object,
};
