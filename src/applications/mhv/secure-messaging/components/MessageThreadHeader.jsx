import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useDispatch } from 'react-redux';
import MessageActionButtons from './MessageActionButtons';
import { Categories, Paths, PageTitles } from '../util/constants';
import { updatePageTitle } from '../util/helpers';
import { closeAlert } from '../actions/alerts';
import CannotReplyAlert from './shared/CannotReplyAlert';

const MessageThreadHeader = props => {
  const {
    message,
    cannotReply,
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
  } = props;
  const { threadId, messageId, category, subject, sentDate } = message;

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const sentReplyDate = format(new Date(sentDate), 'MM-dd-yyyy');
  const cannotReplyDate = addDays(new Date(sentReplyDate), 45);
  const [hideReplyButton, setReplyButton] = useState(false);

  const handleReplyButton = useCallback(
    () => {
      history.push(`${Paths.REPLY}${messageId}/`);
    },
    [history, messageId],
  );

  useEffect(
    () => {
      if (new Date() > cannotReplyDate) {
        setReplyButton(true);
      }
    },
    [cannotReplyDate, hideReplyButton, sentReplyDate, sentDate],
  );

  useEffect(
    () => {
      return () => {
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [location.pathname, dispatch],
  );

  const categoryLabel = Categories[category];

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(
        `${categoryLabel}: ${subject} ${PageTitles.PAGE_TITLE_TAG}`,
      );
    },
    [categoryLabel, message, subject],
  );

  return (
    <div className="message-detail-block">
      <header className="message-detail-header">
        <h1
          className="vads-u-margin-bottom--2"
          aria-label={`Message subject. ${categoryLabel}: ${subject}`}
          data-dd-privacy="mask"
        >
          {categoryLabel}: {subject}
        </h1>
        <CannotReplyAlert visible={cannotReply} />
      </header>
      <MessageActionButtons
        threadId={threadId}
        hideReplyButton={cannotReply}
        handleReplyButton={handleReplyButton}
        isCreateNewModalVisible={isCreateNewModalVisible}
        setIsCreateNewModalVisible={setIsCreateNewModalVisible}
      />
    </div>
  );
};

MessageThreadHeader.propTypes = {
  cannotReply: PropTypes.bool,
  isCreateNewModalVisible: PropTypes.bool,
  message: PropTypes.object,
  setIsCreateNewModalVisible: PropTypes.func,
  onReply: PropTypes.func,
};

export default MessageThreadHeader;
