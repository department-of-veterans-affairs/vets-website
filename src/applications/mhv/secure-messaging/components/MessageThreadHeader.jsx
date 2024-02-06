import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import MessageActionButtons from './MessageActionButtons';
import {
  Categories,
  Paths,
  PageTitles,
  Recipients,
  ParentComponent,
  RecipientStatus,
  BlockedTriageAlertStyles,
} from '../util/constants';
import {
  updatePageTitle,
  updateTriageGroupRecipientStatus,
} from '../util/helpers';
import { closeAlert } from '../actions/alerts';
import CannotReplyAlert from './shared/CannotReplyAlert';
import BlockedTriageGroupAlert from './shared/BlockedTriageGroupAlert';

const MessageThreadHeader = props => {
  const {
    message,
    cannotReply,
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
    recipients,
  } = props;
  const {
    threadId,
    messageId,
    category,
    subject,
    sentDate,
    recipientId,
  } = message;

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const sentReplyDate = format(new Date(sentDate), 'MM-dd-yyyy');
  const cannotReplyDate = addDays(new Date(sentReplyDate), 45);
  const [hideReplyButton, setReplyButton] = useState(false);
  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);
  const [blockedTriageGroupList, setBlockedTriageGroupList] = useState([]);

  const mhvSecureMessagingBlockedTriageGroup1p0 = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingBlockedTriageGroup1p0
      ],
  );

  const messages = useSelector(state => state.sm.threadDetails.messages);

  const handleReplyButton = useCallback(
    () => {
      history.push(`${Paths.REPLY}${messageId}/`);
    },
    [history, messageId],
  );

  useEffect(() => {
    if (mhvSecureMessagingBlockedTriageGroup1p0 && message) {
      const tempRecipient = {
        recipientId,
        name:
          messages.find(m => m.triageGroupName === message.triageGroupName)
            ?.triageGroupName || message.triageGroupName,
        type: Recipients.CARE_TEAM,
        status: RecipientStatus.ALLOWED,
      };

      const {
        isAssociated,
        isBlocked,
        formattedRecipient,
      } = updateTriageGroupRecipientStatus(recipients, tempRecipient);

      if (!isAssociated) {
        setShowBlockedTriageGroupAlert(true);
        setBlockedTriageGroupList([formattedRecipient]);
      } else if (recipients.associatedBlockedTriageGroupsQty) {
        setShowBlockedTriageGroupAlert(isBlocked);
        setBlockedTriageGroupList(
          recipients.blockedRecipients.filter(
            recipient => recipient.name === formattedRecipient.name,
          ),
        );
      }
    }

    // The Blocked Triage Group alert should stay visible until the user navigates away
  }, []);

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
          data-dd-action-name="Link to Message Subject Details"
          aria-label={`Message subject. ${categoryLabel}: ${subject}`}
          data-dd-privacy="mask"
        >
          {categoryLabel}: {subject}
        </h1>
        {mhvSecureMessagingBlockedTriageGroup1p0 ? (
          <CannotReplyAlert
            visible={cannotReply && !showBlockedTriageGroupAlert}
          />
        ) : (
          <CannotReplyAlert visible={cannotReply} />
        )}
      </header>

      {mhvSecureMessagingBlockedTriageGroup1p0 &&
        (showBlockedTriageGroupAlert && (
          <div className="vads-u-margin-top--3 vads-u-margin-bottom--2">
            <BlockedTriageGroupAlert
              blockedTriageGroupList={blockedTriageGroupList}
              alertStyle={BlockedTriageAlertStyles.ALERT}
              parentComponent={ParentComponent.MESSAGE_THREAD}
            />
          </div>
        ))}

      <MessageActionButtons
        threadId={threadId}
        hideReplyButton={
          cannotReply ||
          (mhvSecureMessagingBlockedTriageGroup1p0 &&
            showBlockedTriageGroupAlert)
        }
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
  recipients: PropTypes.object,
  setIsCreateNewModalVisible: PropTypes.func,
  onReply: PropTypes.func,
};

export default MessageThreadHeader;
