import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import ReplyDraftItem from './ReplyDraftItem';
import { Actions } from '../../util/actionTypes';

const ReplyDrafts = props => {
  const {
    cannotReply,
    drafts,
    isSaving,
    replyMessage,
    replyToName,
    setLastFocusableElement,
    signature,
    showBlockedTriageGroupAlert,
    isEditing,
    setIsEditing,
    setHideDraft,
    setIsSending,
  } = props;
  const dispatch = useDispatch();

  return (
    <div>
      <va-accordion bordered open-single={drafts.length <= 1}>
        {drafts?.length ? (
          drafts.map((draft, i) => {
            const singleDraft = draft?.[0] ? draft[0] : draft;
            const subheader = `${singleDraft.body.slice(0, 45)}...`;
            const draftsCount = drafts.length;
            const draftSequence = draftsCount > 1 ? draftsCount - i : null;
            return (
              <va-accordion-item
                bordered="true"
                key={singleDraft.messageId}
                open={isEditing}
                subheader={subheader}
                data-dd-privacy="mask"
              >
                <ReplyDraftItem
                  cannotReply={cannotReply || showBlockedTriageGroupAlert}
                  draft={singleDraft}
                  drafts={drafts}
                  draftsCount={draftsCount}
                  draftSequence={draftSequence}
                  editMode
                  setIsEditing={setIsEditing}
                  isSaving={isSaving}
                  replyMessage={replyMessage}
                  replyToName={replyToName}
                  setLastFocusableElement={setLastFocusableElement}
                  signature={signature}
                  showBlockedTriageGroupAlert={showBlockedTriageGroupAlert}
                  setHideDraft={setHideDraft}
                  setIsSending={setIsSending}
                />
              </va-accordion-item>
            );
          })
        ) : (
          <va-accordion-item bordered="true" open>
            <ReplyDraftItem
              cannotReply={cannotReply}
              drafts={drafts}
              draftsCount={1}
              editMode={isEditing}
              replyMessage={replyMessage}
              replyToName={replyToName}
              setLastFocusableElement={setLastFocusableElement}
              signature={signature}
              isSaving={isSaving}
              toggleEditHandler={() => {
                dispatch({ type: Actions.Thread.RESET_LAST_SAVE_TIME });
              }}
              showBlockedTriageGroupAlert={showBlockedTriageGroupAlert}
              setIsSending={setIsSending}
            />
          </va-accordion-item>
        )}
      </va-accordion>
    </div>
  );
};

ReplyDrafts.propTypes = {
  cannotReply: PropTypes.bool,
  drafts: PropTypes.array || PropTypes.object,
  isEditing: PropTypes.bool,
  isSaving: PropTypes.bool,
  replyMessage: PropTypes.object,
  replyToName: PropTypes.string,
  saveDraftHandler: PropTypes.func,
  setHideDraft: PropTypes.func,
  setIsEditing: PropTypes.func,
  setLastFocusableElement: PropTypes.func,
  showBlockedTriageGroupAlert: PropTypes.bool,
  signature: PropTypes.object,
  setIsSending: PropTypes.func,
};

export default ReplyDrafts;
