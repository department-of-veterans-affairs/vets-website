import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import MigratingFacilitiesAlerts from 'platform/mhv/components/CernerFacilityAlert/MigratingFacilitiesAlerts';
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
import {
  getPageTitle,
  isMigrationPhaseBlockingReplies,
} from '../../util/helpers';
import { clearThread } from '../../actions/threadDetails';
import { getPatientSignature } from '../../actions/preferences';
import useFeatureToggles from '../../hooks/useFeatureToggles';
import ReplyButton from '../ReplyButton';

const ReplyForm = props => {
  const {
    alertSlot,
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
  const { customFoldersRedesignEnabled } = useFeatureToggles();
  const header = useRef();

  const userProfile = useSelector(state => state.user.profile);
  const migratingFacilities = userProfile?.migrationSchedules || [];

  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const signature = useSelector(state => state.sm.preferences?.signature);
  const { replyToName, isSaving, ohMigrationPhase } = useSelector(
    state => state.sm.threadDetails,
  );
  const isInMigrationPhase = isMigrationPhaseBlockingReplies(ohMigrationPhase);

  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState('');
  const [
    showBlockedTriageGroupAlert,
    setShowBlockedTriageGroupAlert,
  ] = useState(false);
  const [hideDraft, setHideDraft] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState(null);

  const hasDraftReplyActive = useMemo(
    () => !cannotReply && !showBlockedTriageGroupAlert && !hideDraft,
    [cannotReply, showBlockedTriageGroupAlert, hideDraft],
  );

  useEffect(
    () => {
      const draftToEdit = drafts?.[0];
      if (draftToEdit) {
        const tempRecipient = {
          recipientId: draftToEdit.recipientId,
          name:
            messages.find(
              m => m.triageGroupName === draftToEdit.triageGroupName,
            )?.triageGroupName || draftToEdit.triageGroupName,
          type: Recipients.CARE_TEAM,
          status: RecipientStatus.ALLOWED,
        };

        setCurrentRecipient(tempRecipient);
      }
      // The Blocked Triage Group alert should stay visible until the draft is sent or user navigates away
    },
    [drafts, messages, recipients],
  );

  useEffect(
    () => {
      const pageTitleTag = getPageTitle({});
      setSubject(replyMessage.subject);
      setCategory(Categories[replyMessage.category]);
      updatePageTitle(pageTitleTag);
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
      return `Messages: ${casedCategory} - ${subject}`;
    },
    [category, subject],
  );

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

        {alertSlot}

        <CannotReplyAlert
          visible={
            cannotReply && !showBlockedTriageGroupAlert && !isInMigrationPhase
          }
          isOhMessage={replyMessage.isOhMessage}
        />

        {isInMigrationPhase && (
          <MigratingFacilitiesAlerts
            healthTool="SECURE_MESSAGING"
            className="vads-u-margin-y--4"
            migratingFacilities={migratingFacilities}
          />
        )}

        {currentRecipient &&
          !isInMigrationPhase && (
            <BlockedTriageGroupAlert
              alertStyle={BlockedTriageAlertStyles.ALERT}
              parentComponent={ParentComponent.REPLY_FORM}
              currentRecipient={currentRecipient}
              setShowBlockedTriageGroupAlert={setShowBlockedTriageGroupAlert}
              isOhMessage={replyMessage.isOhMessage}
            />
          )}

        {customFoldersRedesignEnabled &&
          !hasDraftReplyActive && (
            <ReplyButton
              key="replyButton"
              visible={!cannotReply && !showBlockedTriageGroupAlert}
            />
          )}

        {!customFoldersRedesignEnabled && (
          <MessageActionButtons
            threadId={threadId}
            hideReplyButton={cannotReply || showBlockedTriageGroupAlert}
            isCreateNewModalVisible={isCreateNewModalVisible}
            setIsCreateNewModalVisible={setIsCreateNewModalVisible}
          />
        )}
        <section>
          <form
            className="reply-form vads-u-padding-bottom--2"
            data-testid="reply-form"
          >
            {!cannotReply &&
              !showBlockedTriageGroupAlert && <EmergencyNote dropDownFlag />}
            {/* {DELETE BUTTON IS PRESSED, DELETES SINGLE DRAFT} */}
            {!hideDraft && (
              <>
                <h2 id="draft-reply-header" data-testid="draft-reply-header">
                  {drafts && drafts.length > 1
                    ? 'Draft replies'
                    : 'Draft reply'}
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
  alertSlot: PropTypes.node,
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
