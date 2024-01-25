import React, { useState } from 'react';
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
  } = props;
  const dispatch = useDispatch();
  const [edittedMessage, setEdittedMessage] = useState(
    drafts && drafts[0]?.messageId,
  );
  const toggleEditHandler = messageId => {
    setEdittedMessage(messageId);
    dispatch({ type: Actions.Thread.RESET_LAST_SAVE_TIME });
  };

  return (
    <div>
      {drafts && drafts.length > 1 && <h2>{`${drafts.length} drafts`}</h2>}
      {!drafts?.length && (
        <ReplyDraftItem
          cannotReply={cannotReply}
          editMode
          replyMessage={replyMessage}
          replyToName={replyToName}
          setLastFocusableElement={setLastFocusableElement}
          signature={signature}
          toggleEditHandler={messageId => {
            setEdittedMessage(messageId);
            dispatch({ type: Actions.Thread.RESET_LAST_SAVE_TIME });
          }}
          showBlockedTriageGroupAlert={showBlockedTriageGroupAlert}
        />
      )}

      {drafts?.length > 0 &&
        drafts.map((draft, i) => {
          return (
            <ReplyDraftItem
              key={draft?.messageId}
              cannotReply={cannotReply || showBlockedTriageGroupAlert}
              draft={draft}
              draftsCount={drafts?.length}
              draftsequence={drafts.length - i}
              editMode={
                drafts.length === 1 || edittedMessage === draft?.messageId
              }
              isSaving={isSaving}
              replyMessage={replyMessage}
              replyToName={replyToName}
              setLastFocusableElement={setLastFocusableElement}
              signature={signature}
              toggleEditHandler={toggleEditHandler}
              showBlockedTriageGroupAlert={showBlockedTriageGroupAlert}
            />
          );
        })}
    </div>
  );
};

ReplyDrafts.propTypes = {
  cannotReply: PropTypes.bool,
  drafts: PropTypes.array,
  isSaving: PropTypes.bool,
  replyMessage: PropTypes.object,
  replyToName: PropTypes.string,
  saveDraftHandler: PropTypes.func,
  setLastFocusableElement: PropTypes.func,
  showBlockedTriageGroupAlert: PropTypes.bool,
  signature: PropTypes.string,
};

export default ReplyDrafts;
