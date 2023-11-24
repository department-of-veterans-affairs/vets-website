import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
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
import MessageThreadBody from '../MessageThread/MessageThreadBody';

const ReplyDraftItem = props => {
  const {
    draft,
    cannotReply,
    editMode,
    signature,
    draftsCount,
    draftsequence,
    replyMessage,
    replyToName,
    saveDraftHandler,
    toggleEditHandler,
  } = props;
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
      {draftsCount > 1 && (
        <>
          <h3>Draft {draftsequence}</h3>
          <p>Started {dateFormat(draft.draftDate)}</p>
        </>
      )}
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
            {`To: ${replyToName}\n(Team: ${draft?.triageGroupName ||
              replyMessage.triageGroupName})`}
            <br />
          </span>
          {cannotReply ? (
            <section
              aria-label="Message body."
              className="vads-u-margin-top--1 old-reply-message-body"
            >
              <h3 className="sr-only">Message body.</h3>
              <MessageThreadBody text={draft.messageBody} />
            </section>
          ) : (
            <va-textarea
              data-dd-privacy="mask"
              label="Message"
              required
              id="reply-message-body"
              name="reply-message-body"
              className="message-body"
              data-testid="message-body-field"
              // onInput={messageBodyHandler}
              value={draft?.messageBody || formattededSignature} // populate with the signature, unless there is a saved draft
              // error={bodyError}
              onFocus={e => {
                setCaretToPos(e.target.shadowRoot.querySelector('textarea'), 0);
              }}
            />
          )}

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
            onSaveDraft={(type, e) => saveDraftHandler(type, e)}
            draftId={draft?.messageId}
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
          />
        </>
      )}
    </>
  );
};

ReplyDraftItem.propTypes = {
  cannotReply: PropTypes.bool,
  draft: PropTypes.object,
  draftsCount: PropTypes.number,
  draftsequence: PropTypes.number,
  editMode: PropTypes.bool,
  replyMessage: PropTypes.object,
  replyToName: PropTypes.string,
  saveDraftHandler: PropTypes.func,
  signature: PropTypes.object,
  toggleEditHandler: PropTypes.func,
};

export default ReplyDraftItem;
