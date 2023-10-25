import React, { useState } from 'react';
import drafts from './draftsMocks.json';
import ReplyDraftItem from './ReplyDraftItem';

const ReplyDrafts = props => {
  const { cannotReply, signature } = props;
  const [edittedMessage, setEdittedMessage] = useState(drafts[0].messageId); // [editMode, setEditMode
  // const toggleEditHandler = () => {
  //   setEdittedMessage;
  // };

  return (
    <div>
      {drafts.length > 1 && <h2>{`${drafts.length} drafts`}</h2>}
      {drafts.map(draft => {
        return (
          <ReplyDraftItem
            key={draft.messageId}
            draft={draft}
            signature={signature}
            editMode={edittedMessage === draft.messageId}
            cannotReply={cannotReply}
            toggleEditHandler={messageId => {
              setEdittedMessage(messageId);
            }}
          />
        );
      })}
    </div>
  );
};

export default ReplyDrafts;
