import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  focusElement,
  scrollTo,
} from '@department-of-veterans-affairs/platform-utilities/ui';

import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import EmergencyNote from '../EmergencyNote';
import { updateTriageGroupRecipientStatus } from '../../util/helpers';
import CannotReplyAlert from '../shared/CannotReplyAlert';
import BlockedTriageGroupAlert from '../shared/BlockedTriageGroupAlert';
import ReplyDrafts from './ReplyDrafts';
import MessageActionButtons from '../MessageActionButtons';
import {
  BlockedTriageAlertStyles,
  PageTitles,
  ParentComponent,
  RecipientStatus,
  Recipients,
} from '../../util/constants';
import { clearThread } from '../../actions/threadDetails';
import { getPatientSignature } from '../../actions/preferences';

const ReplyForm = props => {
  const {
    cannotReply,
    drafts,
    replyMessage,
    recipients,
    isCreateNewModalVisible,
    setIsCreateNewModalVisible,
    messages,
    threadId,
    isEditing,
    setIsEditing,
  } = props;
  const dispatch = useDispatch();
  const [lastFocusableElement, setLastFocusableElement] = useState(null);

  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const header = useRef();

  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState('');
  const { replyToName, isSaving } = useSelector(
    state => state.sm.threadDetails,
  );
  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);
  const [blockedTriageGroupList, setBlockedTriageGroupList] = useState([]);

  const signature = useSelector(state => state.sm.preferences.signature);

  useEffect(() => {
    const draftToEdit = drafts?.[0];
    if (draftToEdit) {
      const tempRecipient = {
        recipientId: draftToEdit.recipientId,
        name:
          messages.find(m => m.triageGroupName === draftToEdit.triageGroupName)
            ?.triageGroupName || draftToEdit.triageGroupName,
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
    // The Blocked Triage Group alert should stay visible until the draft is sent or user navigates away
  }, []);

  useEffect(
    () => {
      setSubject(replyMessage.subject);
      setCategory(replyMessage.category);
      updatePageTitle(
        `${replyMessage.category}: ${replyMessage.subject} ${
          PageTitles.PAGE_TITLE_TAG
        }`,
      );
    },
    [replyMessage],
  );

  useEffect(
    () => {
      return () => {
        dispatch(clearThread());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (!signature) {
        dispatch(getPatientSignature());
      }
    },
    [signature, dispatch],
  );

  useEffect(
    () => {
      if (alertStatus) {
        focusElement(lastFocusableElement);
      }
    },
    [alertStatus],
  );

  useEffect(() => {
    if (header.current) {
      focusElement(header.current);
    }
  }, []);

  const messageTitle = useMemo(
    () => {
      const casedCategory =
        category === 'COVID' ? category : capitalize(category);
      return `${casedCategory}: ${subject}`;
    },
    [category, subject],
  );

  return (
    replyMessage && (
      <>
        <h1 ref={header} className="page-title">
          {messageTitle}
        </h1>

        <CannotReplyAlert
          visible={cannotReply && !showBlockedTriageGroupAlert}
        />

        {showBlockedTriageGroupAlert && (
          <BlockedTriageGroupAlert
            blockedTriageGroupList={blockedTriageGroupList}
            alertStyle={BlockedTriageAlertStyles.ALERT}
            parentComponent={ParentComponent.REPLY_FORM}
          />
        )}

        <MessageActionButtons
          threadId={threadId}
          hideReplyButton
          showEditDraftButton={!cannotReply && !showBlockedTriageGroupAlert}
          handleEditDraftButton={() => {
            if (isEditing === false) {
              setIsEditing(true);
              scrollTo('draft-reply-header');
              focusElement(document.getElementById('draft-reply-header'));
            } else {
              setIsEditing(false);
            }
          }}
          hasMultipleDrafts={drafts?.length > 1}
          handleReplyButton={() => {}}
          isCreateNewModalVisible={isCreateNewModalVisible}
          setIsCreateNewModalVisible={setIsCreateNewModalVisible}
        />

        <section>
          <form
            className="reply-form vads-u-padding-bottom--2"
            data-testid="reply-form"
          >
            {!cannotReply &&
              !showBlockedTriageGroupAlert && <EmergencyNote dropDownFlag />}

            {drafts && drafts.length > 1 ? (
              <h2 id="draft-reply-header">Drafts</h2>
            ) : (
              <h2 id="draft-reply-header">Draft</h2>
            )}

            <ReplyDrafts
              drafts={drafts}
              cannotReply={cannotReply}
              isSaving={isSaving}
              replyToName={replyToName}
              replyMessage={replyMessage}
              setLastFocusableElement={setLastFocusableElement}
              signature={signature}
              showBlockedTriageGroupAlert={showBlockedTriageGroupAlert}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </form>
        </section>
      </>
    )
  );
};

ReplyForm.propTypes = {
  cannotReply: PropTypes.bool,
  drafts: PropTypes.array,
  header: PropTypes.object,
  isEditing: PropTypes.bool,
  messages: PropTypes.array,
  recipients: PropTypes.object,
  replyMessage: PropTypes.object,
  setIsEditing: PropTypes.func,
};

export default ReplyForm;
