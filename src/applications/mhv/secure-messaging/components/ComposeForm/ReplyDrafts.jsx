import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import drafts from './draftsMocks.json';
import ReplyDraftItem from './ReplyDraftItem';

const ReplyDrafts = props => {
  const {
    cannotReply,
    signature,
    drafts,
    replyMessage,
    replyToName,
    saveDraftHandler,
  } = props;
  const [edittedMessage, setEdittedMessage] = useState(drafts[0]?.messageId); // [editMode, setEditMode
  // const toggleEditHandler = () => {
  //   setEdittedMessage;
  // };

  return (
    <div>
      {drafts.length > 1 && <h2>{`${drafts.length} drafts`}</h2>}
      {!drafts.length && (
        <ReplyDraftItem
          // key={draft?.messageId}
          // draft={draft}
          // draftsequence={drafts.length - i}
          signature={signature}
          editMode
          // cannotReply={true}
          // cannotReply={cannotReply}
          replyMessage={replyMessage}
          replyToName={replyToName}
          saveDraftHandler={saveDraftHandler}
          toggleEditHandler={messageId => {
            setEdittedMessage(messageId);
          }}
        />
      )}

      {drafts?.length > 0 &&
        drafts.map((draft, i) => {
          return (
            <ReplyDraftItem
              key={draft?.messageId}
              draft={draft}
              draftsCount={drafts?.length}
              draftsequence={drafts.length - i}
              signature={signature}
              editMode={edittedMessage === draft?.messageId}
              // cannotReply={true}
              cannotReply={cannotReply}
              replyMessage={replyMessage}
              replyToName={replyToName}
              saveDraftHandler={saveDraftHandler}
              toggleEditHandler={messageId => {
                setEdittedMessage(messageId);
              }}
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
