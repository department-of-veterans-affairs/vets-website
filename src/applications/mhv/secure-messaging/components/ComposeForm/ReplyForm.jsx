import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FileInput from './FileInput';
import AttachmentsList from '../AttachmentsList';
import { clearDraft, saveReplyDraft } from '../../actions/draftDetails';
import DraftSavedInfo from './DraftSavedInfo';
import useDebounce from '../../hooks/use-debounce';
import DeleteDraft from '../Draft/DeleteDraft';
import { sendReply } from '../../actions/messages';
import EmergencyNote from '../EmergencyNote';
import HowToAttachFiles from '../HowToAttachFiles';
import { dateFormat, navigateToFolderByFolderId } from '../../util/helpers';
import RouteLeavingGuard from '../shared/RouteLeavingGuard';
import { draftAutoSaveTimeout } from '../../util/constants';
import MessageThreadBody from '../MessageThread/MessageThreadBody';

const ReplyForm = props => {
  const { draftToEdit, replyMessage, cannotReplyAlert } = props;
  const dispatch = useDispatch();

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
  const [userSaved, setUserSaved] = useState(false);
  const [navigationError, setNavigationError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const isSaving = useSelector(state => state.sm.draftDetails.isSaving);
  const history = useHistory();
  let draft;

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
      if (sendMessageFlag && isSaving !== true) {
        const messageData = {
          category,
          body: messageBody,
          subject,
          draftId: draft?.messageId,
        };
        messageData[`${'recipient_id'}`] = selectedRecipient;
        if (attachments.length) {
          const sendData = new FormData();
          sendData.append('message', JSON.stringify(messageData));
          attachments.map(upload => sendData.append('uploads[]', upload));
          dispatch(sendReply(replyMessage.messageId, sendData, true)).then(
            () => {
              // history.push(`/thread/${replyMessage.messageId}`);
              navigateToFolderByFolderId(
                draftToEdit.threadFolderId || replyMessage.folderId,
                history,
              );
            },
          );
        } else {
          dispatch(
            sendReply(
              replyMessage.messageId,
              JSON.stringify(messageData),
              false,
            ),
          ).then(() => {
            // history.push(`/thread/${replyMessage.messageId}`);
            navigateToFolderByFolderId(
              draftToEdit.threadFolderId || replyMessage.folderId,
              history,
            );
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
    setFieldsString(
      JSON.stringify({
        rec: draft.recipientId,
        cat: draft.category,
        sub: draft.subject,
        bod: draft.body,
      }),
    );
  };

  if (draftToEdit && !formPopulated) {
    draft = draftToEdit;
    populateForm();
  }

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
      setBodyError('Message body cannot be blank.');
      messageValid = false;
    }
    return messageValid;
  };

  const sendMessageHandler = () => {
    if (checkMessageValidity()) {
      setSendMessageFlag(true);
      setNavigationError(null);
    }
  };

  const saveDraftHandler = type => {
    if (type === 'manual') {
      setUserSaved(true);
      if (!checkMessageValidity()) {
        setSaveError({
          title: "We can't save this message yet",
          p1:
            'We need more information from you before we can save this draft.',
          p2:
            "You can continue editing your draft and then save it. Or you can delete it. If you delete a draft, you can't get it back.",
        });
        return;
      }
      if (attachments.length) {
        setSaveError({
          title: "We can't save attachments in a draft message",
          p1:
            "If you save this message as a draft, you'll need to attach your files again when you're ready to send the message.",
        });
        setNavigationError(null);
      }
    }

    const draftId = draft && draft.messageId;
    const newFieldsString = JSON.stringify({
      rec: selectedRecipient,
      cat: category,
      sub: subject,
      bod: messageBody,
    });

    if (newFieldsString === fieldsString) {
      return;
    }

    setFieldsString(newFieldsString);

    const formData = {
      recipientId: selectedRecipient,
      category,
      subject,
      body: messageBody,
    };

    if (!draftId) {
      dispatch(saveReplyDraft(replyMessage.messageId, formData, type)).then(
        newDraft => {
          draft = newDraft;
          setNewDraftId(newDraft.messageId);
        },
      );
    } else {
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
        debouncedMessageBody
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

  if (!sendMessageFlag && !navigationError && attachments.length) {
    setNavigationError({
      title: "We can't save attachments in a draft message",
      p1:
        "If you save this message as a draft, you'll need to attach your files again when you're ready to send the message.",
      confirmButtonText: 'Continue editing',
      cancelButtonText: 'OK',
    });
  }

  if (replyMessage) {
    return (
      <>
        <h1 className="page-title">{setMessageTitle()}</h1>
        <div role="heading" aria-level="2">
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
            <EmergencyNote />
            <div>
              <h4
                className="vads-u-display--flex vads-u-color--gray-dark vads-u-font-weight--bold"
                style={{ whiteSpace: 'break-spaces' }}
              >
                <i
                  className="fas fa-reply vads-u-margin-right--0p5"
                  aria-hidden="true"
                />
                {`(Draft) To: ${draftToEdit?.replyToName ||
                  replyMessage?.senderName}\n(Team: ${
                  replyMessage.triageGroupName
                })`}
                <br />
              </h4>
              <va-textarea
                label="Message"
                required
                id="reply-message-body"
                name="reply-message-body"
                className="message-body"
                data-testid="message-body-field"
                onInput={e => setMessageBody(e.target.value)}
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
              <div className="compose-form-actions vads-u-display--flex">
                {!cannotReplyAlert && (
                  <button
                    type="button"
                    className="vads-u-flex--1"
                    data-testid="Send-Button"
                    onClick={sendMessageHandler}
                  >
                    Send
                  </button>
                )}
                <button
                  type="button"
                  className="usa-button-secondary vads-u-flex--1"
                  data-testid="Save-Draft-Button"
                  onClick={() => saveDraftHandler('manual')}
                >
                  Save draft
                </button>
                {/* UCD requested to keep button even when not saved as draft */}
                <DeleteDraft draftId={newDraftId} />
              </div>
            </div>
            <DraftSavedInfo userSaved={userSaved} />
            <div className="message-detail-note vads-u-text-align--center">
              <p>
                <i>
                  Note: This message may not be from the person you intially
                  contacted. It may have been reassigned to efficiently address
                  your original message
                </i>
              </p>
            </div>
          </form>
        </div>
        <main
          className="vads-u-margin--0 message-replied-to"
          data-testid="message-replied-to"
        >
          <section aria-label="message details.">
            <p className="vads-u-margin--0">
              <strong>From: </strong>
              {replyMessage.senderName}
            </p>
            <p className="vads-u-margin--0">
              <strong>To: </strong>
              {replyMessage.recipientName}
            </p>
            <p className="vads-u-margin--0">
              <strong>Date: </strong>
              {dateFormat(replyMessage.sentDate)}
            </p>
            <p className="vads-u-margin--0">
              <strong>Message ID: </strong>
              {replyMessage.messageId}
            </p>
          </section>

          <section aria-label="Message body." className="vads-u-margin-top--1">
            <MessageThreadBody text={replyMessage.body} />
          </section>

          {!!replyMessage.attachments &&
            replyMessage.attachments.length > 0 && (
              <>
                <div className="message-body-attachments-label">
                  <strong>Attachments</strong>
                </div>
                <AttachmentsList
                  attachments={replyMessage.attachments}
                  className="attachments-section"
                />
              </>
            )}
        </main>
      </>
    );
  }
  return null;
};

ReplyForm.propTypes = {
  cannotReplyAlert: PropTypes.bool,
  draftToEdit: PropTypes.object,
  recipients: PropTypes.array,
  replyMessage: PropTypes.object,
};

export default ReplyForm;
