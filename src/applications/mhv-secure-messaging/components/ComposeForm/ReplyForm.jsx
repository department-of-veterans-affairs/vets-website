import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  focusElement,
  scrollTo,
} from '@department-of-veterans-affairs/platform-utilities/ui';

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
import useFeatureToggles from '../../hooks/useFeatureToggles';
import ReplyButton from '../ReplyButton';

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
  const { customFoldersRedesignEnabled } = useFeatureToggles();
  const header = useRef();

  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);
  const signature = useSelector(state => state.sm.preferences?.signature);
  const { replyToName, isSaving } = useSelector(
    state => state.sm.threadDetails,
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

  const handleEditDraftButton = useCallback(
    () => {
      if (isEditing === false) {
        setIsEditing(true);
        scrollTo('draft-reply-header');
        focusElement(document.getElementById('draft-reply-header'));
      } else {
        setIsEditing(false);
      }
    },
    [isEditing, setIsEditing],
  );

  const showEditDraftButton = useMemo(
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
    [drafts, recipients],
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

        <CannotReplyAlert
          visible={cannotReply && !showBlockedTriageGroupAlert}
        />

        {currentRecipient && (
          <BlockedTriageGroupAlert
            alertStyle={BlockedTriageAlertStyles.ALERT}
            parentComponent={ParentComponent.REPLY_FORM}
            currentRecipient={currentRecipient}
            setShowBlockedTriageGroupAlert={setShowBlockedTriageGroupAlert}
            isOhMessage={replyMessage.isOhMessage}
          />
        )}

        {customFoldersRedesignEnabled && showEditDraftButton ? (
          <div className="reply-button-container vads-u-flex--3 vads-u-flex--auto">
            <button
              type="button"
              className="usa-button
                  vads-u-width--full
                  mobile-lg:vads-u-width--auto
                  reply-button-in-body
                  vads-u-display--flex
                  vads-u-flex-direction--row
                  vads-u-justify-content--center
                  vads-u-align-items--center
                  vads-u-margin-right--0
                  mobile-lg:vads-u-padding-x--7"
              data-testid="edit-draft-button-body"
              onClick={handleEditDraftButton}
            >
              <div className="vads-u-margin-right--0p5">
                <va-icon icon="undo" aria-hidden="true" />
              </div>
              <span
                className="message-action-button-text"
                data-testid="edit-draft-button-body-text"
              >
                {`Edit draft repl${drafts?.length > 1 ? 'ies' : 'y'}`}
              </span>
            </button>
          </div>
        ) : (
          !showEditDraftButton && (
            <ReplyButton
              key="replyButton"
              visible={!cannotReply && !showBlockedTriageGroupAlert}
            />
          )
        )}

        {!customFoldersRedesignEnabled && (
          <MessageActionButtons
            threadId={threadId}
            hideDraft={hideDraft}
            hideReplyButton={cannotReply || showBlockedTriageGroupAlert}
            replyMsgId={replyMessage.messageId}
            showEditDraftButton={showEditDraftButton}
            handleEditDraftButton={handleEditDraftButton}
            hasMultipleDrafts={drafts?.length > 1}
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
