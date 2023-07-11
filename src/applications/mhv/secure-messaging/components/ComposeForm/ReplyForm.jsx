import React, { useState, useEffect } from 'react';
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
import DeleteDraft from '../Draft/DeleteDraft';
import { sendReply } from '../../actions/messages';
import { focusOnErrorField } from '../../util/formHelpers';
import EmergencyNote from '../EmergencyNote';
import HowToAttachFiles from '../HowToAttachFiles';
import { dateFormat, navigateToFolderByFolderId } from '../../util/helpers';
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
  const [bodyError, setBodyError] = useState('');
  const [sendMessageFlag, setSendMessageFlag] = useState(false);
  const [newDraftId, setNewDraftId] = useState(
    draftToEdit ? draftToEdit.messageId : null,
  );
  const [userSaved, setUserSaved] = useState(false);
  const [navigationError, setNavigationError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [messageInvalid, setMessageInvalid] = useState(false);
  const [isAutosave, setIsAutosave] = useState(true); // to halt autosave debounce on message send and resume if message send failed

  const draftDetails = useSelector(state => state.sm.draftDetails);
  const { isSaving } = draftDetails;

  // sendReply call requires an id for the message being replied to
  // if a thread contains a saved draft, sendReply call will use the draft's id in params and in body
  // otherwise it will be an id of a message being replied to
  const replyToMessageId = draftDetails.replyToMessageId
    ? draftDetails.replyToMessageId
    : replyMessage.messageId;
  const history = useHistory();
  const [draft, setDraft] = useState(null);

  const debouncedSubject = useDebounce(subject, draftAutoSaveTimeout);
  const debouncedMessageBody = useDebounce(messageBody, draftAutoSaveTimeout);
  const attachmentNames = attachments.reduce((currentString, item) => {
    return currentString + item.name;
  }, '');

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
        if (attachments.length) {
          const sendData = new FormData();
          sendData.append('message', JSON.stringify(messageData));
          attachments.map(upload => sendData.append('uploads[]', upload));

          dispatch(sendReply(replyToMessageId, sendData, true))
            .then(() => {
              navigateToFolderByFolderId(
                draftToEdit?.threadFolderId
                  ? draftToEdit?.threadFolderId
                  : replyMessage.folderId,
                history,
              );
            })
            .catch(() => {
              setSendMessageFlag(false);
              setIsAutosave(true);
            });
        } else {
          dispatch(
            sendReply(replyToMessageId, JSON.stringify(messageData), false),
          )
            .then(() => {
              navigateToFolderByFolderId(
                draftToEdit?.threadFolderId
                  ? draftToEdit?.threadFolderId
                  : replyMessage.folderId,
                history,
              );
            })
            .catch(() => {
              setSendMessageFlag(false);
              setIsAutosave(true);
            });
        }
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
    if (draft.attachments) {
      setAttachments(draft.attachments);
    }
    setFormPopulated(true);
  };

  useEffect(
    () => {
      if (draft && !formPopulated) {
        populateForm();
      }
    },
    [draft],
  );

  const setMessageTitle = () => {
    const casedCategory =
      category === 'COVID' ? category : capitalize(category);
    if (category && subject) {
      return `${casedCategory}: ${subject}`;
    }
    if (category && !subject) {
      return `${casedCategory}:`;
    }
    if (!category && subject) {
      return subject;
    }
    return 'New message';
  };

  const checkMessageValidity = () => {
    let messageValid = true;
    if (messageBody === '' || messageBody.match(/^[\s]+$/)) {
      setBodyError(ErrorMessages.ComposeForm.BODY_REQUIRED);
      messageValid = false;
    }
    setMessageInvalid(!messageValid);
    return messageValid;
  };

  const sendMessageHandler = async e => {
    await setMessageInvalid(false);
    if (checkMessageValidity()) {
      setSendMessageFlag(true);
      setNavigationError(null);
      setLastFocusableElement(e.target);
    }
  };

  const saveDraftHandler = async (type, e) => {
    if (type === 'manual') {
      setUserSaved(true);

      await setMessageInvalid(false);
      if (checkMessageValidity()) {
        setLastFocusableElement(e.target);
        setNavigationError(null);
      }
      if (attachments.length) {
        setSaveError(ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT);
        setNavigationError(null);
      }
    }

    const draftId = draft && draft.messageId;

    const formData = {
      recipientId: selectedRecipient,
      category,
      subject,
      body: messageBody,
    };

    if (!draftId) {
      if (checkMessageValidity()) {
        dispatch(saveReplyDraft(replyMessage.messageId, formData, type)).then(
          newDraft => {
            setDraft(newDraft);
            setNewDraftId(newDraft.messageId);
          },
        );
      }
    } else if (checkMessageValidity()) {
      dispatch(saveReplyDraft(replyMessage.messageId, formData, type, draftId));
    }
    if (!attachments.length) setNavigationError(null);
  };

  useEffect(
    () => {
      if (
        selectedRecipient &&
        category &&
        debouncedSubject &&
        debouncedMessageBody &&
        isAutosave
      ) {
        saveDraftHandler('auto');
      }
    },
    [
      attachmentNames,
      category,
      debouncedMessageBody,
      debouncedSubject,
      selectedRecipient,
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

  if (replyMessage) {
    return (
      <>
        <h1 ref={header} className="page-title">
          {setMessageTitle()}
        </h1>
        <CannotReplyAlert visible={cannotReply} />

        <section>
          <h2 className="sr-only">Reply draft edit mode.</h2>
          <form
            className="reply-form"
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
            <EmergencyNote dropDownFlag />
            <div>
              <span
                className="vads-u-display--flex vads-u-margin-top--3 vads-u-color--gray-dark vads-u-font-size--h4 vads-u-font-weight--bold"
                style={{ whiteSpace: 'break-spaces', overflowWrap: 'anywhere' }}
              >
                <i
                  className="fas fa-reply vads-u-margin-right--0p5 vads-u-margin-top--0p25"
                  aria-hidden="true"
                />
                {`(Draft) To: ${draftToEdit?.replyToName ||
                  replyMessage?.senderName}\n(Team: ${
                  replyMessage.triageGroupName
                })`}
                <br />
              </span>
              <va-textarea
                label="Message"
                required
                id="reply-message-body"
                name="reply-message-body"
                className="message-body"
                data-testid="message-body-field"
                onInput={messageBodyHandler}
                value={messageBody}
                error={bodyError}
              />
              <section className="attachments-section vads-u-margin-top--2">
                <strong>Attachments</strong>
                <HowToAttachFiles />
                <AttachmentsList
                  attachments={attachments}
                  setAttachments={setAttachments}
                  editingEnabled
                />

                <FileInput
                  attachments={attachments}
                  setAttachments={setAttachments}
                />
              </section>
              <DraftSavedInfo userSaved={userSaved} />
              <div className="compose-form-actions vads-u-display--flex">
                {!cannotReply && (
                  <va-button
                    text="Send"
                    class="vads-u-flex--1 send-button vads-u-margin-bottom--1"
                    data-testid="Send-Button"
                    onClick={sendMessageHandler}
                  />
                )}

                <va-button
                  id="save-draft-button"
                  text="Save draft"
                  secondary
                  class="vads-u-flex--1 save-draft-button vads-u-margin-bottom--1"
                  data-testid="Save-Draft-Button"
                  onClick={e => saveDraftHandler('manual', e)}
                />
                {/* UCD requested to keep button even when not saved as draft */}
                <DeleteDraft
                  draftId={newDraftId}
                  setLastFocusableElement={setLastFocusableElement}
                  setNavigationError={setNavigationError}
                />
              </div>
            </div>
          </form>
        </section>
        <section
          aria-label="Message you are replying to"
          className="vads-u-margin--0 message-replied-to"
          data-testid="message-replied-to"
        >
          <h2 className="sr-only">Message you are replying to.</h2>
          <div>
            <h3 className="sr-only">Message details</h3>
            <p className="vads-u-margin--0">
              <strong>From: </strong>
              {replyMessage.senderName}
            </p>
            <p className="vads-u-margin--0" data-testid="message-to">
              <strong>To: </strong>
              {replyMessage.recipientName}
            </p>
            <p className="vads-u-margin--0" data-testid="message-date">
              <strong>Date: </strong>
              {dateFormat(replyMessage.sentDate)}
            </p>
            <p className="vads-u-margin--0" data-testid="message-id">
              <strong>Message ID: </strong>
              {replyMessage.messageId}
            </p>
          </div>

          <section aria-label="Message body." className="vads-u-margin-top--1">
            <h3 className="sr-only">Message body.</h3>
            <MessageThreadBody text={replyMessage.body} />
          </section>

          {!!replyMessage.attachments &&
            replyMessage.attachments.length > 0 && (
              <>
                <h3 className="sr-only">Message attachments.</h3>
                <AttachmentsList
                  attachments={replyMessage.attachments}
                  className="attachments-section"
                />
              </>
            )}
        </section>
      </>
    );
  }
  return null;
};

ReplyForm.propTypes = {
  cannotReply: PropTypes.bool,
  draftToEdit: PropTypes.object,
  header: PropTypes.object,
  recipients: PropTypes.array,
  replyMessage: PropTypes.object,
};

export default ReplyForm;
