import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import HorizontalRule from '../shared/HorizontalRule';
import {
  decodeHtmlEntities,
  getStationNumberFromRecipientId,
  messageSignatureFormatter,
  navigateToFolderByFolderId,
  setCaretToPos,
} from '../../util/helpers';
import AttachmentsList from '../AttachmentsList';
import FileInput from './FileInput';
import DraftSavedInfo from './DraftSavedInfo';
import ComposeFormActionButtons from './ComposeFormActionButtons';
import MessageThreadBody from '../MessageThread/MessageThreadBody';
import {
  ErrorMessages,
  draftAutoSaveTimeout,
  Alerts,
} from '../../util/constants';
import useDebounce from '../../hooks/use-debounce';
import { saveReplyDraft } from '../../actions/draftDetails';
import RouteLeavingGuard from '../shared/RouteLeavingGuard';
import { retrieveMessageThread, sendReply } from '../../actions/messages';
import { focusOnErrorField } from '../../util/formHelpers';
import { updateDraftInProgress } from '../../actions/threadDetails';

const ReplyDraftItem = props => {
  const {
    draft,
    drafts,
    cannotReply,
    editMode,
    isSaving,
    signature,
    draftsCount,
    draftSequence,
    replyMessage,
    replyToName,
    setLastFocusableElement,
    showBlockedTriageGroupAlert,
    setHideDraft,
    setIsEditing,
    setIsSending,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const textareaRef = useRef(null);
  const composeFormActionButtonsRef = useRef(null);

  const folderId = useSelector(state => state.sm.folders.folder?.folderId);

  const draftInProgress = useSelector(
    state => state.sm.threadDetails?.draftInProgress,
  );

  const allRecipients = useSelector(
    state => state.sm.recipients?.allRecipients,
  );

  const isOhTriageGroup = useMemo(
    () => {
      return replyMessage?.isOhMessage;
    },
    [replyMessage],
  );

  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [formPopulated, setFormPopulated] = useState(false);
  const [sendMessageFlag, setSendMessageFlag] = useState(false);
  const [fieldsString, setFieldsString] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const debouncedMessageBody = useDebounce(messageBody, draftAutoSaveTimeout);

  const navigationError = draftInProgress?.navigationError;
  const setNavigationError = useCallback(
    error => {
      dispatch(updateDraftInProgress({ navigationError: error }));
    },
    [dispatch],
  );
  const [isAutosave, setIsAutosave] = useState(true); // to halt autosave debounce on message send and resume if message send failed
  const [attachFileSuccess, setAttachFileSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [bodyError, setBodyError] = useState('');
  const [messageInvalid, setMessageInvalid] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [focusToTextarea, setFocusToTextarea] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const setSavedDraft = useCallback(
    value => {
      dispatch(updateDraftInProgress({ savedDraft: value }));
    },
    [dispatch],
  );
  const [attachFileError, setAttachFileError] = useState(null);

  const alertsList = useSelector(state => state.sm.alerts.alertList);
  const attachmentScanError = useMemo(
    () =>
      alertsList?.filter(
        alert =>
          alert.content === Alerts.Message.ATTACHMENT_SCAN_FAIL &&
          alert.isActive,
      ).length > 0,
    [alertsList],
  );

  const replyToMessageId = draft?.messageId || replyMessage.messageId;

  const formattededSignature = useMemo(
    () => {
      return messageSignatureFormatter(signature);
    },
    [signature],
  );

  const refreshThreadHandler = useCallback(
    () => {
      dispatch(retrieveMessageThread(replyMessage.messageId));
    },
    [replyMessage, dispatch],
  );

  const checkMessageValidity = useCallback(
    () => {
      let messageValid = true;
      if (messageBody === '' || messageBody.match(/^[\s]+$/)) {
        setBodyError(ErrorMessages.ComposeForm.BODY_REQUIRED);
        messageValid = false;
      }
      setMessageInvalid(!messageValid);
      return { messageValid };
    },
    [messageBody],
  );

  const messageBodyHandler = e => {
    setMessageBody(e.target.value);
    if (e.target.value) setBodyError('');
  };

  useEffect(
    () => {
      if (draft) {
        setDraftId(draft.messageId);
      }
    },
    [draft],
  );

  // OnSave Reply Draft
  const saveDraftHandler = useCallback(
    async (type, e) => {
      // Prevents 'auto' from running if isModalVisible is open
      if (type === 'auto' && isModalVisible) {
        return;
      }

      const { messageValid } = checkMessageValidity();

      if (type === 'manual') {
        if (messageValid) {
          setSavedDraft(true);
          setLastFocusableElement(e?.target);
        }
        if (attachments.length) {
          setSaveError(
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
          );
        } else focusOnErrorField();
        setNavigationError(
          attachments.length
            ? {
                ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
                confirmButtonText: 'Continue editing',
                cancelButtonText: 'Delete draft',
              }
            : null,
        );
      }

      const newFieldsString = JSON.stringify({
        rec: selectedRecipient,
        cat: category,
        sub: subject,
        bod: debouncedMessageBody || messageBody,
      });

      if (type === 'auto' && newFieldsString === fieldsString) {
        return;
      }

      const formData = {
        recipientId: selectedRecipient,
        category,
        subject,
        body: messageBody,
      };

      if (messageValid) {
        if (!draftId) {
          setFieldsString(newFieldsString);
          dispatch(saveReplyDraft(replyMessage.messageId, formData, type));
        } else if (typeof draftId === 'number') {
          setFieldsString(newFieldsString);
          dispatch(
            saveReplyDraft(replyMessage.messageId, formData, type, draftId),
          );
        }
        setSavedDraft(true);
      }
      if (!attachments.length) setNavigationError(null);
    },
    [
      isModalVisible,
      checkMessageValidity,
      selectedRecipient,
      category,
      subject,
      debouncedMessageBody,
      messageBody,
      fieldsString,
      attachments,
      setNavigationError,
      setSavedDraft,
      setLastFocusableElement,
      draftId,
      dispatch,
      replyMessage.messageId,
    ],
  );
  const sendMessageHandler = useCallback(
    async e => {
      const { messageValid } = checkMessageValidity();

      await setMessageInvalid(false);
      if (messageValid) {
        setSendMessageFlag(true);
        setNavigationError(null);
        setLastFocusableElement(e.target);
      } else focusOnErrorField();
    },
    [checkMessageValidity, setLastFocusableElement, setNavigationError],
  );

  // Navigation error effect
  useEffect(
    () => {
      const draftBody = draft && draft.body;
      const blankDraft = messageBody === '' && draftBody === undefined;
      const savedEdits = messageBody === draftBody;
      if (savedEdits || blankDraft) {
        setNavigationError(null);
      }
      if (!savedEdits && blankDraft && attachments.length > 0) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
        });
      }
      if (
        (!savedEdits && !blankDraft && attachments.length > 0) ||
        (savedEdits && attachments.length > 0)
      ) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
          p1: '',
        });
      }
      if (!draft && !savedEdits && !blankDraft && attachments.length === 0) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.CONT_SAVING_DRAFT,
        });
      }
      if (draft && draftBody !== messageBody && attachments.length === 0) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.CONT_SAVING_DRAFT_CHANGES,
        });
      }
    },
    [attachments.length, draft, messageBody, setNavigationError],
  );

  useEffect(
    () => {
      if (replyMessage && !draft) {
        setSelectedRecipient(replyMessage.senderId);
        setSubject(replyMessage.subject);
        setMessageBody('');
        setCategory(replyMessage.category);
      }
    },
    [replyMessage, draft],
  );

  useEffect(
    () => {
      if (
        editMode &&
        debouncedMessageBody &&
        isAutosave &&
        !cannotReply &&
        !isModalVisible
      ) {
        saveDraftHandler('auto');
      }
    },
    [
      cannotReply,
      debouncedMessageBody,
      editMode,
      isAutosave,
      isModalVisible,
      saveDraftHandler,
    ],
  );

  // sending a reply message
  useEffect(
    () => {
      if (sendMessageFlag && isSaving !== true) {
        const messageData = {
          category,
          body: messageBody,
          subject,
        };
        if (draft && replyToMessageId) {
          messageData[`${'draft_id'}`] = replyToMessageId; // if replying to a thread that has a saved draft, set a draft_id field in a request body
        }
        messageData[`${'recipient_id'}`] = selectedRecipient;
        messageData[`${'station_number'}`] = getStationNumberFromRecipientId(
          selectedRecipient,
          allRecipients,
        );
        setIsAutosave(false);

        const decodedMessageData = {
          ...messageData,
          body: decodeHtmlEntities(messageData.body),
          subject: decodeHtmlEntities(messageData.subject),
        };

        const sendData =
          attachments.length > 0
            ? (() => {
                const formData = new FormData();
                formData.append('message', JSON.stringify(decodedMessageData));
                attachments.forEach(upload =>
                  formData.append('uploads[]', upload),
                );
                return formData;
              })()
            : JSON.stringify(decodedMessageData);

        setIsSending(true);
        dispatch(
          sendReply({
            replyToId: replyToMessageId,
            message: sendData,
            attachments: attachments.length > 0,
            ohTriageGroup: isOhTriageGroup,
          }),
        )
          .then(() => {
            setTimeout(() => {
              if (draftsCount > 1) {
                // send a call to get updated thread
                dispatch(retrieveMessageThread(replyMessage.messageId)).then(
                  setIsSending(false),
                );
              } else {
                setIsSending(false);
                navigateToFolderByFolderId(
                  draft?.threadFolderId ? draft?.threadFolderId : folderId,
                  history,
                );
              }
            }, 1000);
          })
          .catch(() => {
            setIsSending(false);
            setSendMessageFlag(false);
            setIsAutosave(true);
          });
      }
    },
    [
      sendMessageFlag,
      isSaving,
      category,
      messageBody,
      subject,
      draft,
      replyToMessageId,
      selectedRecipient,
      attachments,
      setIsSending,
      dispatch,
      draftsCount,
      replyMessage.messageId,
      allRecipients,
      folderId,
      history,
      isOhTriageGroup,
    ],
  );

  const populateForm = () => {
    setSelectedRecipient(draft?.recipientId);
    setCategory(draft.category);
    setSubject(draft.subject);
    setMessageBody(draft.body);
    setFormPopulated(true);
    setFieldsString(
      JSON.stringify({
        rec: draft.recipientId,
        cat: draft.category,
        sub: draft.subject,
        bod: draft.body,
      }),
    );
  };

  useEffect(
    () => {
      if (messageInvalid) {
        focusOnErrorField();
      }
    },
    [messageInvalid],
  );

  useEffect(
    () => {
      if (draft && !formPopulated) {
        populateForm();
      }
    },
    [draft, formPopulated, populateForm],
  );

  useEffect(
    () => {
      if (editMode && focusToTextarea) {
        setTimeout(() => {
          focusElement(
            cannotReply
              ? composeFormActionButtonsRef.current?.querySelector(
                  '#delete-draft-button',
                )
              : textareaRef.current,
          );
          setFocusToTextarea(false);
        }, 300);
      }
    },
    [cannotReply, editMode, focusToTextarea],
  );

  return (
    <>
      {saveError && (
        <VaModal
          modalTitle={saveError.title}
          onPrimaryButtonClick={() => setSaveError(null)}
          onCloseEvent={() => setSaveError(null)}
          primaryButtonText="Continue editing"
          status="warning"
          visible
        >
          <p>{saveError.p1}</p>
          {saveError.p2 && <p>{saveError.p2}</p>}
        </VaModal>
      )}
      <RouteLeavingGuard saveDraftHandler={saveDraftHandler} type="reply" />

      <h3 className="vads-u-margin-bottom--0p5" slot="headline">
        [Draft
        {draftSequence ? ` ${draftSequence}]` : ']'}
      </h3>
      <>
        <span
          className="vads-u-display--flex vads-u-margin-top--3 vads-u-color--gray-dark vads-u-font-size--h4 vads-u-font-weight--bold"
          data-testid="draft-reply-to"
          style={{ whiteSpace: 'break-spaces', overflowWrap: 'anywhere' }}
          data-dd-privacy="mask"
          data-dd-action-name="Reply Draft Accordion Header"
        >
          <div className="vads-u-margin-right--0p5 vads-u-margin-top--0p25">
            <va-icon icon="undo" aria-hidden="true" />
          </div>
          <span className="thread-list-draft reply-draft-label vads-u-padding-right--2">
            {`Draft ${draftSequence ? `${draftSequence} ` : ''}`}
          </span>
          {`To: ${replyToName}\n(Team: ${draft?.suggestedNameDisplay ||
            replyMessage?.suggestedNameDisplay ||
            draft?.triageGroupName ||
            replyMessage.triageGroupName})`}
          <br />
        </span>
        <HorizontalRule />
        {cannotReply ? (
          <section
            aria-label="Message body."
            className="vads-u-margin-top--1 old-reply-message-body"
          >
            <h3 className="sr-only">Message body.</h3>
            <MessageThreadBody text={draft?.body} />
          </section>
        ) : (
          <va-textarea
            ref={textareaRef}
            data-dd-privacy="mask"
            label="Message"
            required
            id={`reply-message-body${draftSequence ? `-${draftSequence}` : ''}`}
            name={`reply-message-body${
              draftSequence ? `-${draftSequence}` : ''
            }`}
            className="message-body"
            data-testid={`message-body-field${
              draftSequence ? `-${draftSequence}` : ''
            }`}
            onInput={messageBodyHandler}
            value={draft?.body || formattededSignature} // populate with the signature, unless there is a saved draft
            error={bodyError}
            onFocus={e => {
              setCaretToPos(e.target.shadowRoot.querySelector('textarea'), 0);
            }}
          />
        )}

        {!cannotReply &&
          !showBlockedTriageGroupAlert && (
            <section className="attachments-section vads-u-margin-top--2">
              <AttachmentsList
                attachments={attachments}
                reply
                setAttachments={setAttachments}
                setNavigationError={setNavigationError}
                editingEnabled
                attachFileSuccess={attachFileSuccess}
                setAttachFileSuccess={setAttachFileSuccess}
                draftSequence={draftSequence}
                attachmentScanError={attachmentScanError}
                attachFileError={attachFileError}
                setAttachFileError={setAttachFileError}
                isOhTriageGroup={isOhTriageGroup}
              />

              <FileInput
                attachments={attachments}
                setAttachments={setAttachments}
                setAttachFileSuccess={setAttachFileSuccess}
                draftSequence={draftSequence}
                attachmentScanError={attachmentScanError}
                attachFileError={attachFileError}
                setAttachFileError={setAttachFileError}
                isOhTriageGroup={isOhTriageGroup}
              />
            </section>
          )}
        <DraftSavedInfo messageId={draftId} drafts={drafts} />

        <div ref={composeFormActionButtonsRef}>
          <ComposeFormActionButtons
            cannotReply={showBlockedTriageGroupAlert || cannotReply}
            draftId={draft?.messageId}
            draftsCount={draftsCount}
            draftBody={draft?.body}
            messageBody={messageBody}
            navigationError={navigationError}
            onSaveDraft={(type, e) => saveDraftHandler(type, e)}
            onSend={sendMessageHandler}
            refreshThreadCallback={refreshThreadHandler}
            setNavigationError={setNavigationError}
            draftSequence={draftSequence}
            setHideDraft={setHideDraft}
            setIsEditing={setIsEditing}
            setIsModalVisible={setIsModalVisible}
            isModalVisible={isModalVisible}
          />
        </div>
      </>
    </>
  );
};

ReplyDraftItem.propTypes = {
  cannotReply: PropTypes.bool,
  draft: PropTypes.object,
  draftSequence: PropTypes.number,
  drafts: PropTypes.array,
  draftsCount: PropTypes.number,
  editMode: PropTypes.bool,
  isSaving: PropTypes.bool,
  replyMessage: PropTypes.object,
  replyToName: PropTypes.string,
  setHideDraft: PropTypes.func,
  setIsEditing: PropTypes.func,
  setIsSending: PropTypes.func,
  setLastFocusableElement: PropTypes.func,
  showBlockedTriageGroupAlert: PropTypes.bool,
  signature: PropTypes.object,
};

export default ReplyDraftItem;
