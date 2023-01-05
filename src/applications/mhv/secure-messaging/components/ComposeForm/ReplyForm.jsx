import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FileInput from './FileInput';
import AttachmentsList from '../AttachmentsList';
import { saveReplyDraft } from '../../actions/draftDetails';
import DraftSavedInfo from './DraftSavedInfo';
import useDebounce from '../../hooks/use-debounce';
import DiscardDraft from '../Draft/DiscardDraft';
import { sendReply } from '../../actions/messages';
import EmergencyNote from '../EmergencyNote';
import HowToAttachFiles from '../HowToAttachFiles';
import { dateFormat } from '../../util/helpers';

const ReplyForm = props => {
  const { draftToEdit, replyMessage } = props;
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
  const isSaving = useSelector(state => state.sm.draftDetails.isSaving);
  const history = useHistory();
  let draft;

  const debouncedSubject = useDebounce(subject, 3000);
  const debouncedMessageBody = useDebounce(messageBody, 3000);
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
          dispatch(sendReply(replyMessage.messageId, sendData, true)).then(() =>
            history.push(`/message/${replyMessage.messageId}`),
          );
        } else {
          dispatch(
            sendReply(
              replyMessage.messageId,
              JSON.stringify(messageData),
              false,
            ),
          ).then(() => {
            history.push(`/message/${replyMessage.messageId}`);
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

  const sendMessageHandler = () => {
    if (messageBody === '' || messageBody.match(/^[\s]+$/)) {
      setBodyError('Message body cannot be blank.');
    } else {
      setSendMessageFlag(true);
    }
  };

  const saveDraftHandler = type => {
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

  if (replyMessage) {
    return (
      <>
        <h1 className="page-title">{setMessageTitle()}</h1>
        <form className="reply-form" onSubmit={sendMessageHandler}>
          <EmergencyNote />
          <div>
            <p>
              <i
                className="fas fa-reply vads-u-margin-right--0p5"
                aria-hidden="true"
              />
              <strong>
                <strong className="vads-u-color--secondary-darkest">
                  (Draft)
                </strong>{' '}
                To:{' '}
              </strong>
              {replyMessage.senderName}
            </p>
            <va-textarea
              label="Message"
              required
              id="message-body"
              name="message-body"
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
              <button
                type="button"
                className="vads-u-flex--1"
                data-testid="Send-Button"
                onClick={sendMessageHandler}
              >
                Send
              </button>
              <button
                type="button"
                className="usa-button-secondary vads-u-flex--1"
                data-testid="Save-Draft-Button"
                onClick={() => {
                  setUserSaved(true);
                  saveDraftHandler('manual');
                }}
              >
                Save draft
              </button>
              {/* UCD requested to keep button even when not saved as draft */}
              <DiscardDraft draftId={newDraftId} />
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
        <main className="vads-u-margin--0">
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

          <section aria-label="Message body.">
            <pre>{replyMessage.body}</pre>
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
  draftToEdit: PropTypes.object,
  recipients: PropTypes.array,
  replyMessage: PropTypes.object,
};

export default ReplyForm;
