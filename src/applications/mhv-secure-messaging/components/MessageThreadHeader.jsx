import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useLocation } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import MessageActionButtons from './MessageActionButtons';
import {
  Categories,
  Recipients,
  ParentComponent,
  RecipientStatus,
  BlockedTriageAlertStyles,
} from '../util/constants';
import { getPageTitle, scrollIfFocusedAndNotInView } from '../util/helpers';
import { closeAlert } from '../actions/alerts';
import CannotReplyAlert from './shared/CannotReplyAlert';
import BlockedTriageGroupAlert from './shared/BlockedTriageGroupAlert';
import useFeatureToggles from '../hooks/useFeatureToggles';
import ReplyButton from './ReplyButton';

const MessageThreadHeader = props => {
  const {
    message,
    cannotReply,
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
  } = props;

  const {
    threadId,
    category,
    subject,
    sentDate,
    recipientId,
    isOhMessage = false,
  } = message;

  const { customFoldersRedesignEnabled } = useFeatureToggles();

  const dispatch = useDispatch();
  const location = useLocation();
  const sentReplyDate = format(new Date(sentDate), 'MM-dd-yyyy');
  const cannotReplyDate = addDays(new Date(sentReplyDate), 45);
  const [hideReplyButton, setReplyButton] = useState(false);
  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState(null);

  const messages = useSelector(state => state.sm.threadDetails.messages);

  useEffect(
    () => {
      if (message) {
        const tempRecipient = {
          recipientId,
          name:
            messages.find(m => m.triageGroupName === message.triageGroupName)
              ?.triageGroupName || message.triageGroupName,
          suggestedNameDisplay: message.suggestedNameDisplay,
          type: Recipients.CARE_TEAM,
          status: RecipientStatus.ALLOWED,
        };

        setCurrentRecipient(tempRecipient);
      }

      // The Blocked Triage Group alert should stay visible until the user navigates away
    },
    [message, messages, recipientId],
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
      const pageTitleTag = getPageTitle({});
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitleTag);
    },
    [categoryLabel, message, subject],
  );

  useEffect(() => {
    setTimeout(() => {
      scrollIfFocusedAndNotInView(50);
    }, 100);
  }, []);

  return (
    <div className="message-detail-block">
      <header className="message-detail-header">
        <h1
          className="vads-u-margin-bottom--2"
          data-dd-action-name="Link to Message Subject Details"
          aria-label={`Message subject. ${categoryLabel}: ${subject}`}
          data-dd-privacy="mask"
        >
          {`Messages: ${categoryLabel} - ${subject}`}
        </h1>

        <CannotReplyAlert
          visible={cannotReply && !showBlockedTriageGroupAlert}
          isOhMessage={isOhMessage}
        />
      </header>

      {currentRecipient && (
        <div className="vads-u-margin-top--3 vads-u-margin-bottom--2">
          <BlockedTriageGroupAlert
            alertStyle={BlockedTriageAlertStyles.ALERT}
            parentComponent={ParentComponent.MESSAGE_THREAD}
            currentRecipient={currentRecipient}
            setShowBlockedTriageGroupAlert={setShowBlockedTriageGroupAlert}
            isOhMessage={isOhMessage}
          />
        </div>
      )}

      {customFoldersRedesignEnabled ? (
        <ReplyButton
          key="replyButton"
          visible={!cannotReply && !showBlockedTriageGroupAlert}
        />
      ) : (
        <MessageActionButtons
          threadId={threadId}
          hideReplyButton={cannotReply || showBlockedTriageGroupAlert}
          isCreateNewModalVisible={isCreateNewModalVisible}
          setIsCreateNewModalVisible={setIsCreateNewModalVisible}
        />
      )}
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
