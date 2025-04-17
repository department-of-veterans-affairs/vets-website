import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  focusElement,
  scrollTo,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import EmergencyNote from '../EmergencyNote';
import CannotReplyAlert from '../shared/CannotReplyAlert';
import BlockedTriageGroupAlert from '../shared/BlockedTriageGroupAlert';
import ReplyDrafts from './ReplyDrafts';
import MessageActionButtons from '../MessageActionButtons';
import {
  BlockedTriageAlertStyles,
  Categories,
  ParentComponent,
  RecipientStatus,
  Recipients,
} from '../../util/constants';
import { getPageTitle } from '../../util/helpers';
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
    setIsSending,
  } = props;
  const dispatch = useDispatch();
  const header = useRef();

  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const signature = useSelector(state => state.sm.preferences?.signature);
  const { replyToName, isSaving } = useSelector(
    state => state.sm.threadDetails,
  );
  const removeLandingPageFF = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingRemoveLandingPage
      ],
  );

  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState('');
  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);
  const [hideDraft, setHideDraft] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState(null);

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

      setCurrentRecipient(tempRecipient);
    }
    // The Blocked Triage Group alert should stay visible until the draft is sent or user navigates away
  }, [drafts, recipients]);

  useEffect(() => {
    const pageTitleTag = getPageTitle({ removeLandingPageFF });
    setSubject(replyMessage.subject);
    setCategory(Categories[replyMessage.category]);
    updatePageTitle(pageTitleTag);
  }, [removeLandingPageFF, replyMessage]);

  useEffect(() => {
    return () => {
      dispatch(clearThread());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!signature) {
      dispatch(getPatientSignature());
    }
  }, [signature, dispatch]);

  useEffect(() => {
    if (alertStatus) {
      focusElement(lastFocusableElement);
    }
  }, [alertStatus]);

  useEffect(() => {
    if (header.current) {
      focusElement(header.current);
    }
  }, []);

  const messageTitle = useMemo(() => {
    const casedCategory =
      category === 'COVID' ? category : capitalize(category);
    return `${
      removeLandingPageFF
        ? `Messages: ${casedCategory} - ${subject}`
        : `${casedCategory}: ${subject}`
    }`;
  }, [category, removeLandingPageFF, subject]);

  return (
    replyMessage && (
      <>
        <h1
          ref={header}
          className="page-title"
          data-dd-privacy="mask"
          data-dd-action-name="Reply Form Header"
          data-testid="reply-form-title"
        >
          {messageTitle}
        </h1>

        <CannotReplyAlert
          visible={cannotReply && !showBlockedTriageGroupAlert}
        />

        {currentRecipient && (
          <BlockedTriageGroupAlert
            alertStyle={BlockedTriageAlertStyles.ALERT}
            parentComponent={ParentComponent.REPLY_FORM}
            currentRecipient={currentRecipient}
            setShowBlockedTriageGroupAlert={setShowBlockedTriageGroupAlert}
          />
        )}

        <MessageActionButtons
          threadId={threadId}
          hideDraft={hideDraft}
          hideReplyButton={cannotReply || showBlockedTriageGroupAlert}
          replyMsgId={replyMessage.messageId}
          showEditDraftButton={
            !cannotReply && !showBlockedTriageGroupAlert && !hideDraft
          }
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
          isCreateNewModalVisible={isCreateNewModalVisible}
          setIsCreateNewModalVisible={setIsCreateNewModalVisible}
        />
        <section>
          <form
            className="reply-form vads-u-padding-bottom--2"
            data-testid="reply-form"
          >
            {!cannotReply && !showBlockedTriageGroupAlert && (
              <EmergencyNote dropDownFlag />
            )}
            {/* {DELETE BUTTON IS PRESSED, DELETES SINGLE DRAFT} */}
            {!hideDraft && (
              <>
                <h2 id="draft-reply-header">
                  {drafts && drafts.length > 1 ? 'Drafts' : 'Draft'}
                </h2>
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
                  setHideDraft={setHideDraft}
                  setIsSending={setIsSending}
                />
              </>
            )}
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
  isCreateNewModalVisible: PropTypes.bool,
  isEditing: PropTypes.bool,
  messages: PropTypes.array,
  recipients: PropTypes.object,
  replyMessage: PropTypes.object,
  setIsCreateNewModalVisible: PropTypes.func,
  setIsEditing: PropTypes.func,
  setIsSending: PropTypes.func,
  threadId: PropTypes.number,
};

export default ReplyForm;
