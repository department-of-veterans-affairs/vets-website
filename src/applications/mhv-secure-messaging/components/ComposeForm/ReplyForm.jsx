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
  const [blockedTriageGroupList, setBlockedTriageGroupList] = useState([]);
  const [hideDraft, setHideDraft] = useState(false);

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

      if (!isAssociated || isBlocked) {
        setShowBlockedTriageGroupAlert(true);
        setBlockedTriageGroupList([formattedRecipient]);
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
          hideDraft={hideDraft}
          hideReplyButton
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
            {!cannotReply &&
              !showBlockedTriageGroupAlert && <EmergencyNote dropDownFlag />}
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
  threadId: PropTypes.number,
};

export default ReplyForm;
