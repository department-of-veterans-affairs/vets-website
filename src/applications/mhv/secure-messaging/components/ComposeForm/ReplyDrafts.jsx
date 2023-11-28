import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import drafts from './draftsMocks.json';
import { useDispatch } from 'react-redux';
import ReplyDraftItem from './ReplyDraftItem';
import { Actions } from '../../util/actionTypes';

const ReplyDrafts = props => {
  const {
    cannotReply,
    signature,
    drafts,
    replyMessage,
    replyToName,
    setLastFocusableElement,
    isSaving,
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
          signature={signature}
          editMode
          // cannotReply={true}
          cannotReply={cannotReply}
          replyMessage={replyMessage}
          replyToName={replyToName}
          setLastFocusableElement={setLastFocusableElement}
          toggleEditHandler={messageId => {
            setEdittedMessage(messageId);
            dispatch({ type: Actions.Thread.RESET_LAST_SAVE_TIME });
          }}
        />
      )}

      {drafts?.length > 0 &&
        drafts.map((draft, i) => {
          return (
            <ReplyDraftItem
              key={draft?.messageId}
              // cannotReply={true}
              cannotReply={cannotReply}
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
            />
          );
        })}
    </div>
  );
};

ReplyDrafts.propTypes = {
  cannotReply: PropTypes.bool,
  drafts: PropTypes.array,
  replyMessage: PropTypes.object,
  replyToName: PropTypes.string,
  saveDraftHandler: PropTypes.func,
  signature: PropTypes.string,
};

export default ReplyDrafts;
