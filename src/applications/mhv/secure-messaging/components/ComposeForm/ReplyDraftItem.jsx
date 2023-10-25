import React, { useMemo, useState } from 'react';
import HorizontalRule from '../shared/HorizontalRule';
import {
  dateFormat,
  messageSignatureFormatter,
  setCaretToPos,
} from '../../util/helpers';
import AttachmentsList from '../AttachmentsList';
import FileInput from './FileInput';
import DraftSavedInfo from './DraftSavedInfo';
import ComposeFormActionButtons from './ComposeFormActionButtons';

const ReplyDraftItem = props => {
  const { draft, cannotReply, editMode, signature, toggleEditHandler } = props;
  const [attachments, setAttachments] = useState([]);
  const [userSaved] = useState(false);
  //   const [userSaved, setUserSaved] = useState(false);
  const formattededSignature = useMemo(
    () => {
      return messageSignatureFormatter(signature);
    },
    [signature],
  );
  return (
    <>
      <HorizontalRule />
      <h3>Draft 3</h3>
      <p>Started {dateFormat(draft.draftDate)}</p>
      {editMode ? (
        <>
          <span
            className="vads-u-display--flex vads-u-margin-top--3 vads-u-color--gray-dark vads-u-font-size--h4 vads-u-font-weight--bold"
            style={{ whiteSpace: 'break-spaces', overflowWrap: 'anywhere' }}
            data-dd-privacy="mask"
          >
            <i
              className="fas fa-reply vads-u-margin-right--0p5 vads-u-margin-top--0p25"
              aria-hidden="true"
            />
            <span className="thread-list-draft reply-draft-label vads-u-padding-right--0p5">
              {`(Draft) `}
            </span>
            {`To: ${draft?.replyToName || draft?.senderName}\n(Team: ${
              draft.triageGroupName
            })`}
            <br />
          </span>
          <va-textarea
            data-dd-privacy="mask"
            label="Message"
            required
            id="reply-message-body"
            name="reply-message-body"
            className="message-body"
            data-testid="message-body-field"
            // onInput={messageBodyHandler}
            value={draft.messageBody || formattededSignature} // populate with the signature, unless there is a saved draft
            // error={bodyError}
            onFocus={e => {
              setCaretToPos(e.target.shadowRoot.querySelector('textarea'), 0);
            }}
          />
          {!cannotReply && (
            <section className="attachments-section vads-u-margin-top--2">
              <AttachmentsList
                attachments={attachments}
                setAttachments={setAttachments}
                // setNavigationError={setNavigationError}
                editingEnabled
              />

              <FileInput
                attachments={attachments}
                setAttachments={setAttachments}
              />
            </section>
          )}

          <DraftSavedInfo userSaved={userSaved} />
          <ComposeFormActionButtons
            // onSend={sendMessageHandler}
            // onSaveDraft={(type, e) => saveDraftHandler(type, e)}
            draftId={draft.messageId}
            // setNavigationError={setNavigationError}
            cannotReply={cannotReply}
          />
        </>
      ) : (
        <>
          <p className="vads-u-margin-top--2">{draft.messageBody}</p>
          <va-button
            secondary
            text="Edit draft"
            onClick={() => {
              toggleEditHandler(draft.messageId);
            }}
          />{' '}
        </>
      )}
    </>
  );
};

export default ReplyDraftItem;
