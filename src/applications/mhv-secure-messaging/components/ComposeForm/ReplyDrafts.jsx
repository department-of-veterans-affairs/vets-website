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
  } = props;
  const dispatch = useDispatch();
  const toggleEditHandler = () => {
    dispatch({ type: Actions.Thread.RESET_LAST_SAVE_TIME });
    setIsEditing(true);
  };

  return (
    <div>
      <va-accordion bordered open-single>
        {drafts?.length ? (
          drafts.map((draft, i) => {
            const subheader = `${draft?.body.slice(0, 45)}...`;
            const draftsCount = drafts.length;
            const draftSequence = draftsCount > 1 ? draftsCount - i : null;

            return (
              <va-accordion-item
                bordered="true"
                key={draft?.messageId}
                open={isEditing}
                subheader={subheader}
              >
                <ReplyDraftItem
                  cannotReply={cannotReply || showBlockedTriageGroupAlert}
                  draft={draft}
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
                  toggleEditHandler={toggleEditHandler}
                  showBlockedTriageGroupAlert={showBlockedTriageGroupAlert}
                  setHideDraft={setHideDraft}
                />
              </va-accordion-item>
            );
          })
        ) : (
          <va-accordion-item bordered="true" open>
            <ReplyDraftItem
              cannotReply={cannotReply}
              drafts={drafts}
              draftsCount={0}
              editMode={isEditing}
              replyMessage={replyMessage}
              replyToName={replyToName}
              setLastFocusableElement={setLastFocusableElement}
              signature={signature}
              toggleEditHandler={() => {
                dispatch({ type: Actions.Thread.RESET_LAST_SAVE_TIME });
              }}
              showBlockedTriageGroupAlert={showBlockedTriageGroupAlert}
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
  setIsEditing: PropTypes.func,
  setLastFocusableElement: PropTypes.func,
  showBlockedTriageGroupAlert: PropTypes.bool,
  signature: PropTypes.object,
};

export default ReplyDrafts;
