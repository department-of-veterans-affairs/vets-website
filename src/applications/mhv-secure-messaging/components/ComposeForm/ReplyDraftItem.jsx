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
  messageSignatureFormatter,
  navigateToFolderByFolderId,
  resetUserSession,
  setCaretToPos,
} from '../../util/helpers';
import AttachmentsList from '../AttachmentsList';
import FileInput from './FileInput';
import DraftSavedInfo from './DraftSavedInfo';
import ComposeFormActionButtons from './ComposeFormActionButtons';
import MessageThreadBody from '../MessageThread/MessageThreadBody';
import { ErrorMessages, draftAutoSaveTimeout } from '../../util/constants';
import useDebounce from '../../hooks/use-debounce';
import { saveReplyDraft } from '../../actions/draftDetails';
import RouteLeavingGuard from '../shared/RouteLeavingGuard';
import { retrieveMessageThread, sendReply } from '../../actions/messages';
import { focusOnErrorField } from '../../util/formHelpers';

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
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const textareaRef = useRef(null);
  const composeFormActionButtonsRef = useRef(null);

  const folderId = useSelector(state => state.sm.folders.folder?.folderId);

  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [formPopulated, setFormPopulated] = useState(false);
  const [sendMessageFlag, setSendMessageFlag] = useState(false);
  const [fieldsString, setFieldsString] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const debouncedMessageBody = useDebounce(messageBody, draftAutoSaveTimeout);
  const [navigationError, setNavigationError] = useState(null);
  const [isAutosave, setIsAutosave] = useState(true); // to halt autosave debounce on message send and resume if message send failed
  const [modalVisible, setModalVisible] = useState(false);
  const [attachFileSuccess, setAttachFileSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [bodyError, setBodyError] = useState('');
  const [messageInvalid, setMessageInvalid] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [focusToTextarea, setFocusToTextarea] = useState(false);
  const [draftId, setDraftId] = useState(null);

  const localStorageValues = useMemo(() => {
    return {
      atExpires: localStorage.atExpires,
      hasSession: localStorage.hasSession,
      sessionExpiration: localStorage.sessionExpiration,
      userFirstName: localStorage.userFirstName,
    };
  }, []);

  const { signOutMessage, timeoutId } = resetUserSession(localStorageValues);

  const replyToMessageId = draft?.messageId || replyMessage.messageId;

  const noTimeout = () => {
    clearTimeout(timeoutId);
  };

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

  const beforeUnloadHandler = useCallback(
    e => {
      if (messageBody !== (draft ? draft.body : '') || attachments.length) {
        e.preventDefault();
        window.onbeforeunload = () => signOutMessage;
        e.returnValue = true;
      } else {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        window.onbeforeunload = null;
        e.returnValue = false;
        noTimeout();
      }
    },
    [draft, messageBody, attachments],
  );

  useEffect(
    () => {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        window.onbeforeunload = null;
        noTimeout();
      };
    },
    [beforeUnloadHandler],
  );

  const checkMessageValidity = useCallback(
    () => {
      let messageValid = true;
      if (messageBody === '' || messageBody.match(/^[\s]+$/)) {
        setBodyError(ErrorMessages.ComposeForm.BODY_REQUIRED);
        messageValid = false;
      }
      setMessageInvalid(!messageValid);
      return messageValid;
    },
    [messageBody],
  );

  const messageBodyHandler = e => {
    setMessageBody(e.target.value);
    if (e.target.value) setBodyError('');
  };

  // Send message navigation error with attachments message
  if (!sendMessageFlag && !navigationError && attachments.length) {
    setNavigationError({
      ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
      confirmButtonText: 'Continue editing',
      cancelButtonText: 'OK',
    });
  }

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

      const isValidMessage = checkMessageValidity();

      if (type === 'manual') {
        setMessageInvalid(false);
        if (isValidMessage) {
          setLastFocusableElement(e.target);
        }
        if (attachments.length) {
          setSaveError(
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
          );
        }
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

      if (isValidMessage) {
        if (!draftId) {
          setFieldsString(newFieldsString);
          dispatch(saveReplyDraft(replyMessage.messageId, formData, type));
        } else if (typeof draftId === 'number') {
          setFieldsString(newFieldsString);
          dispatch(
            saveReplyDraft(replyMessage.messageId, formData, type, draftId),
          );
        }
      }
      if (!attachments.length) setNavigationError(null);
    },
    [
      attachments.length,
      category,
      checkMessageValidity,
      debouncedMessageBody,
      dispatch,
      draft,
      fieldsString,
      messageBody,
      replyMessage.messageId,
      selectedRecipient,
      subject,
      isModalVisible,
    ],
  );
  const sendMessageHandler = useCallback(
    async e => {
      await setMessageInvalid(false);
      if (checkMessageValidity()) {
        setSendMessageFlag(true);
        setNavigationError(null);
        setLastFocusableElement(e.target);
      }
    },
    [checkMessageValidity, setLastFocusableElement],
  );

  // Before Save
  useEffect(
    () => {
      const draftBody = draft && draft.body;
      if (
        messageBody === draftBody ||
        (messageBody === '' && draftBody === undefined)
      ) {
        setNavigationError(null);
      } else if (messageBody !== draftBody) {
        // Stimulates unable to save navigation error modal on reply drafts after messagebody changes
        setNavigationError({
          ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
          confirmButtonText: 'Continue editing',
          cancelButtonText: 'Delete draft',
        });
      }
    },
    [draft, messageBody],
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
        !modalVisible
      ) {
        saveDraftHandler('auto');
      }
    },
    [
      cannotReply,
      debouncedMessageBody,
      isAutosave,
      modalVisible,
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
        setIsAutosave(false);

        let sendData;

        if (attachments.length > 0) {
          sendData = new FormData();
          sendData.append('message', JSON.stringify(messageData));
          attachments.map(upload => sendData.append('uploads[]', upload));
        } else {
          sendData = JSON.stringify(messageData);
        }

        dispatch(sendReply(replyToMessageId, sendData, attachments.length > 0))
          .then(() => {
            if (draftsCount > 1) {
              // send a call to get updated thread
              dispatch(retrieveMessageThread(replyMessage.messageId));
            } else {
              navigateToFolderByFolderId(
                draft?.threadFolderId ? draft?.threadFolderId : folderId,
                history,
              );
            }
          })
          .catch(() => {
            setSendMessageFlag(false);
            setIsAutosave(true);
          });
      }
    },
    [sendMessageFlag, isSaving],
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
    [draft, formPopulated],
  );

  // Send message navigation error with attachments message
  if (!sendMessageFlag && !navigationError && attachments.length) {
    setNavigationError({
      ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
      confirmButtonText: 'Continue editing',
      cancelButtonText: 'OK',
    });
  }

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
      <RouteLeavingGuard
        when={!!navigationError}
        modalVisible={modalVisible}
        updateModalVisible={setModalVisible}
        navigate={path => {
          history.push(path);
        }}
        shouldBlockNavigation={() => {
          return !!navigationError;
        }}
        title={navigationError?.title}
        p1={navigationError?.p1}
        p2={navigationError?.p2}
        confirmButtonText={navigationError?.confirmButtonText}
        cancelButtonText={navigationError?.cancelButtonText}
      />

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
        >
          <div className="vads-u-margin-right--0p5 vads-u-margin-top--0p25">
            <va-icon icon="undo" aria-hidden="true" />
          </div>
          <span className="thread-list-draft reply-draft-label vads-u-padding-right--2">
            {`Draft ${draftSequence ? `${draftSequence} ` : ''}`}
          </span>
          {`To: ${replyToName}\n(Team: ${draft?.triageGroupName ||
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
              />

              <FileInput
                attachments={attachments}
                setAttachments={setAttachments}
                setAttachFileSuccess={setAttachFileSuccess}
                draftSequence={draftSequence}
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
  setLastFocusableElement: PropTypes.func,
  showBlockedTriageGroupAlert: PropTypes.bool,
  signature: PropTypes.object,
};

export default ReplyDraftItem;
