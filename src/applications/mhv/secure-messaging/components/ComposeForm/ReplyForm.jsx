import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import FileInput from './FileInput';
import AttachmentsList from '../AttachmentsList';
import { clearDraft, saveReplyDraft } from '../../actions/draftDetails';
import DraftSavedInfo from './DraftSavedInfo';
import useDebounce from '../../hooks/use-debounce';
import ComposeFormActionButtons from './ComposeFormActionButtons';
import { sendReply } from '../../actions/messages';
import { focusOnErrorField } from '../../util/formHelpers';
import EmergencyNote from '../EmergencyNote';
import {
  messageSignatureFormatter,
  navigateToFolderByFolderId,
  resetUserSession,
  setCaretToPos,
} from '../../util/helpers';
import RouteLeavingGuard from '../shared/RouteLeavingGuard';
import { ErrorMessages, draftAutoSaveTimeout } from '../../util/constants';
import MessageThreadBody from '../MessageThread/MessageThreadBody';
import CannotReplyAlert from '../shared/CannotReplyAlert';

const ReplyForm = props => {
  const { draftToEdit, replyMessage, cannotReply, header } = props;
  const dispatch = useDispatch();
  const [lastFocusableElement, setLastFocusableElement] = useState(null);
  const alertStatus = useSelector(state => state.sm.alerts?.alertFocusOut);

  const defaultRecipientsList = [{ id: 0, name: ' ' }];
  const [recipientsList, setRecipientsList] = useState(defaultRecipientsList);
  const [selectedRecipient, setSelectedRecipient] = useState(
    defaultRecipientsList[0].id,
  );
  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [formPopulated, setFormPopulated] = useState(false);
  const [fieldsString, setFieldsString] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [sendMessageFlag, setSendMessageFlag] = useState(false);
  const [newDraftId, setNewDraftId] = useState(
    draftToEdit ? draftToEdit.messageId : null,
  );
  const [navigationError, setNavigationError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [messageInvalid, setMessageInvalid] = useState(false);
  const [isAutosave, setIsAutosave] = useState(true); // to halt autosave debounce on message send and resume if message send failed
  const [modalVisible, updateModalVisible] = useState(false);
  const [attachFileSuccess, setAttachFileSuccess] = useState(false);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);

  const draftDetails = useSelector(state => state.sm.draftDetails);
  const folderId = useSelector(state => state.sm.folders.folder?.folderId);
  const { isSaving } = draftDetails;
  const signature = useSelector(state => state.sm.preferences.signature);

  // sendReply call requires an id for the message being replied to
  // if a thread contains a saved draft, sendReply call will use the draft's id in params and in body
  // otherwise it will be an id of a message being replied to
  const replyToMessageId = draftDetails.replyToMessageId
    ? draftDetails.replyToMessageId
    : replyMessage.messageId;
  const history = useHistory();
  const [draft, setDraft] = useState(null);

  const debouncedMessageBody = useDebounce(messageBody, draftAutoSaveTimeout);

  const localStorageValues = useMemo(() => {
    return {
      atExpires: localStorage.atExpires,
      hasSession: localStorage.hasSession,
      sessionExpiration: localStorage.sessionExpiration,
      userFirstName: localStorage.userFirstName,
    };
  }, []);

  const { signOutMessage, timeoutId } = resetUserSession(localStorageValues);

  const noTimeout = () => {
    clearTimeout(timeoutId);
  };

  const formattededSignature = useMemo(
    () => {
      return messageSignatureFormatter(signature);
    },
    [signature],
  );

  useEffect(
    () => {
      if (replyMessage && !draftToEdit) {
        setSelectedRecipient(replyMessage.senderId);
        setSubject(replyMessage.subject);
        setMessageBody('');
        setCategory(replyMessage.category);
      }
      if (draftToEdit) {
        setDraft(draftToEdit);
      }
    },
    [replyMessage, draftToEdit],
  );

  useEffect(
    () => {
      return () => {
        dispatch(clearDraft());
      };
    },
    [dispatch],
  );

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
      if (alertStatus) {
        focusElement(lastFocusableElement);
      }
    },
    [alertStatus],
  );

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
            navigateToFolderByFolderId(
              draftToEdit?.threadFolderId
                ? draftToEdit?.threadFolderId
                : folderId,
              history,
            );
          })
          .catch(() => {
            setSendMessageFlag(false);
            setIsAutosave(true);
          });
      }
    },
    [sendMessageFlag, isSaving],
  );

  const recipientExists = recipientId => {
    return recipientsList.findIndex(item => +item.id === +recipientId) > -1;
  };

  const populateForm = () => {
    if (!recipientExists(draft.recipientId)) {
      const newRecipient = {
        id: draft.recipientId,
        name: draft.recipientName,
      };
      setRecipientsList(prevRecipientsList => [
        ...prevRecipientsList,
        newRecipient,
      ]);
      setSelectedRecipient(newRecipient.id);
    }
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
      if (draft && !formPopulated) {
        populateForm();
      }
    },
    [draft],
  );

  const messageTitle = useMemo(
    () => {
      const casedCategory =
        category === 'COVID' ? category : capitalize(category);
      return `${casedCategory}: ${subject}`;
    },
    [category, subject],
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

  const sendMessageHandler = useCallback(
    async e => {
      await setMessageInvalid(false);
      if (checkMessageValidity()) {
        setSendMessageFlag(true);
        setNavigationError(null);
        setLastFocusableElement(e.target);
      }
    },
    [checkMessageValidity],
  );

  // On Save
  const saveDraftHandler = useCallback(
    async (type, e) => {
      if (type === 'manual') {
        await setMessageInvalid(false);
        if (checkMessageValidity()) {
          setLastFocusableElement(e.target);
          setNavigationError(null);
        }
        if (attachments.length) {
          setSaveError(
            ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
          );
          setNavigationError({
            ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
            confirmButtonText: 'Continue editing',
            cancelButtonText: 'Delete draft',
          });
        }
      }

      const draftId = draft && draft.messageId;
      const newFieldsString = JSON.stringify({
        rec: selectedRecipient,
        cat: category,
        sub: subject,
        bod: debouncedMessageBody || messageBody,
      });

      if (type === 'auto' && newFieldsString === fieldsString) {
        return;
      }

      setFieldsString(newFieldsString);

      const formData = {
        recipientId: selectedRecipient,
        category,
        subject,
        body: messageBody,
      };

      if (checkMessageValidity()) {
        if (!draftId) {
          dispatch(saveReplyDraft(replyMessage.messageId, formData, type)).then(
            newDraft => {
              setDraft(newDraft);
              setNewDraftId(newDraft.messageId);
            },
          );
        } else {
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
    ],
  );

  // Before Save
  useEffect(
    () => {
      const draftBody = draft && draft.body;
      if (
        messageBody === draftBody ||
        (messageBody === '' && draftBody === null)
      ) {
        setNavigationError(null);
      } else if (messageBody !== draftBody) {
        setNavigationError({
          ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE,
          confirmButtonText: 'Continue editing',
          cancelButtonText: 'Delete draft',
        });
      }
    },
    [deleteButtonClicked, draft, messageBody],
  );

  useEffect(
    () => {
      if (debouncedMessageBody && isAutosave && !cannotReply && !modalVisible) {
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

  const messageBodyHandler = e => {
    setMessageBody(e.target.value);
    if (e.target.value) setBodyError('');
  };

  if (!sendMessageFlag && !navigationError && attachments.length) {
    setNavigationError({
      ...ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT,
      confirmButtonText: 'Continue editing',
      cancelButtonText: 'OK',
    });
  }

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

  return (
    replyMessage && (
      <>
        <h1 ref={header} className="page-title">
          {messageTitle}
        </h1>
        <CannotReplyAlert visible={cannotReply} />

        <section>
          <h2 className="sr-only">Reply draft edit mode.</h2>
          <form
            className="reply-form vads-u-padding-bottom--2"
            data-testid="reply-form"
            onSubmit={sendMessageHandler}
          >
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
              updateModalVisible={updateModalVisible}
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
            {!cannotReply && <EmergencyNote dropDownFlag />}
            <div>
              <span
                className="vads-u-display--flex vads-u-margin-top--3 vads-u-color--gray-dark vads-u-font-size--h4 vads-u-font-weight--bold"
                data-testid="message-reply-to"
                style={{ whiteSpace: 'break-spaces', overflowWrap: 'anywhere' }}
                data-dd-privacy="mask"
                data-dd-action-name="Reply To Message Sender Input"
              >
                <i
                  className="fas fa-reply vads-u-margin-right--0p5 vads-u-margin-top--0p25"
                  aria-hidden="true"
                />
                <span className="thread-list-draft reply-draft-label vads-u-padding-right--0p5">
                  {`(Draft) `}
                </span>
                {`To: ${draftToEdit?.replyToName ||
                  replyMessage?.senderName}\n(Team: ${
                  replyMessage.triageGroupName
                })`}
                <br />
              </span>

              {!cannotReply ? (
                <va-textarea
                  data-dd-privacy="mask"
                  data-dd-action-name="Reply Message Body Textbox"
                  label="Message"
                  required
                  id="reply-message-body"
                  name="reply-message-body"
                  className="message-body"
                  data-testid="message-body-field"
                  onInput={messageBodyHandler}
                  value={messageBody || formattededSignature} // populate with the signature, unless there is a saved draft
                  error={bodyError}
                  onFocus={e => {
                    setCaretToPos(
                      e.target.shadowRoot.querySelector('textarea'),
                      0,
                    );
                  }}
                />
              ) : (
                <section
                  aria-label="Message body."
                  className="vads-u-margin-top--1 old-reply-message-body"
                >
                  <h3 className="sr-only">Message body.</h3>
                  <MessageThreadBody text={messageBody} />
                </section>
              )}

              {!cannotReply && (
                <section className="attachments-section vads-u-margin-top--2">
                  <AttachmentsList
                    attachments={attachments}
                    setAttachments={setAttachments}
                    setNavigationError={setNavigationError}
                    editingEnabled
                    attachFileSuccess={attachFileSuccess}
                    setAttachFileSuccess={setAttachFileSuccess}
                  />

                  <FileInput
                    attachments={attachments}
                    setAttachments={setAttachments}
                    setAttachFileSuccess={setAttachFileSuccess}
                  />
                </section>
              )}

              <DraftSavedInfo />
              <ComposeFormActionButtons
                onSend={sendMessageHandler}
                onSaveDraft={(type, e) => saveDraftHandler(type, e)}
                draftId={newDraftId}
                setNavigationError={setNavigationError}
                cannotReply={cannotReply}
                setDeleteButtonClicked={setDeleteButtonClicked}
                messageBody={messageBody}
              />
            </div>
          </form>
        </section>
      </>
    )
  );
};

ReplyForm.propTypes = {
  cannotReply: PropTypes.bool,
  draftToEdit: PropTypes.object,
  header: PropTypes.object,
  recipients: PropTypes.array,
  replyMessage: PropTypes.object,
};

export default ReplyForm;
