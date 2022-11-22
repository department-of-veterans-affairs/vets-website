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

const ReplyForm = props => {
  const { draft, replyMessage } = props;
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
  const isSaving = useSelector(state => state.sm.draftDetails.isSaving);
  const history = useHistory();

  const debouncedSubject = useDebounce(subject, 3000);
  const debouncedMessageBody = useDebounce(messageBody, 3000);
  const attachmentNames = attachments.reduce((currentString, item) => {
    return currentString + item.name;
  }, '');

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
          dispatch(sendReply(replyMessage.messageId, sendData, true));
        } else {
          dispatch(
            sendReply(
              replyMessage.messageId,
              JSON.stringify(messageData),
              false,
            ),
          ).then(() => history.push(`/message/${replyMessage.messageId}`));
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

  if (draft && !formPopulated) populateForm();

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

    dispatch(saveReplyDraft(replyMessage.messageId, formData, type, draftId));
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
      <form className="compose-form" onSubmit={sendMessageHandler}>
        <div className="compose-form-header" data-testid="compose-form-header">
          <h3>{setMessageTitle()}</h3>
          <button
            type="button"
            className="send-button-top"
            onClick={sendMessageHandler}
          >
            <i className="fas fa-paper-plane" aria-hidden="true" />
            <span className="send-button-top-text">Send</span>
          </button>
        </div>
        <div className="compose-inputs-container">
          <p>
            <strong>Replying To: </strong>
            {replyMessage.senderName}
          </p>
          <p>
            <strong>Category: </strong>
            {category}
          </p>
          <p>
            <strong>Subject: </strong>
            {subject}
          </p>
          <div className="message-body-field">
            <label htmlFor="message-body">
              Message
              <span className="required"> (*Required)</span>
            </label>
            <va-textarea
              id="message-body"
              name="message-body"
              className="message-body"
              data-testid="message-body-field"
              onChange={e => setMessageBody(e.target.value)}
              value={messageBody}
              error={bodyError}
            />
          </div>
          <section className="attachments-section">
            <div className="compose-attachments-heading">Attachments</div>

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
              onClick={() => saveDraftHandler('manual')}
            >
              Save draft
            </button>
            <div className="vads-u-flex--1 vads-u-display--flex">
              {draft && <DiscardDraft draft={draft} />}
            </div>
          </div>
        </div>
        <DraftSavedInfo />
      </form>
    );
  }
  return null;
};

ReplyForm.propTypes = {
  draft: PropTypes.object,
  recipients: PropTypes.array,
};

export default ReplyForm;
