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
  } = props;
  const dispatch = useDispatch();
  const toggleEditHandler = () => {
    dispatch({ type: Actions.Thread.RESET_LAST_SAVE_TIME });
  };

  return (
    <div>
      {!drafts?.length && (
        <ReplyDraftItem
          cannotReply={cannotReply}
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
      )}

      {drafts?.length > 0 && (
        <va-accordion bordered>
          {drafts.map((draft, i) => {
            return (
              <va-accordion-item
                bordered="true"
                key={draft?.messageId}
                open={isEditing}
                subheader={`${draft?.body.slice(0, 45)}...`}
              >
                <ReplyDraftItem
                  cannotReply={cannotReply || showBlockedTriageGroupAlert}
                  draft={draft}
                  draftsCount={drafts?.length}
                  draftsequence={drafts?.length > 1 && drafts.length - i}
                  editMode
                  isSaving={isSaving}
                  replyMessage={replyMessage}
                  replyToName={replyToName}
                  setLastFocusableElement={setLastFocusableElement}
                  signature={signature}
                  toggleEditHandler={toggleEditHandler}
                  showBlockedTriageGroupAlert={showBlockedTriageGroupAlert}
                />
              </va-accordion-item>
            );
          })}
        </va-accordion>
      )}
    </div>
  );
};

ReplyDrafts.propTypes = {
  cannotReply: PropTypes.bool,
  drafts: PropTypes.array,
  isEditing: PropTypes.bool,
  isSaving: PropTypes.bool,
  replyMessage: PropTypes.object,
  replyToName: PropTypes.string,
  saveDraftHandler: PropTypes.func,
  setLastFocusableElement: PropTypes.func,
  showBlockedTriageGroupAlert: PropTypes.bool,
  signature: PropTypes.object,
};

export default ReplyDrafts;
