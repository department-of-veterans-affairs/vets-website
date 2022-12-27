import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FileInput from './FileInput';
import CategoryInput from './CategoryInput';
import AttachmentsList from '../AttachmentsList';
import { saveDraft } from '../../actions/draftDetails';
import DraftSavedInfo from './DraftSavedInfo';
import useDebounce from '../../hooks/use-debounce';
import DiscardDraft from '../Draft/DiscardDraft';
import { sortRecipients } from '../../util/helpers';
import { sendMessage } from '../../actions/messages';

const ComposeForm = props => {
  const { draft, recipients } = props;
  const dispatch = useDispatch();

  const defaultRecipientsList = [{ id: 0, name: ' ' }];
  const [recipientsList, setRecipientsList] = useState(defaultRecipientsList);
  const [selectedRecipient, setSelectedRecipient] = useState(
    defaultRecipientsList[0].id,
  );
  const [category, setCategory] = useState(null);
  const [categoryError, setCategoryError] = useState('');
  const [bodyError, setBodyError] = useState(null);
  const [recipientError, setRecipientError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [formPopulated, setFormPopulated] = useState(false);
  const [fieldsString, setFieldsString] = useState('');
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
      setRecipientsList(prevRecipientsList => [
        ...prevRecipientsList.filter(
          oldRecip => !recipients.find(newRecip => newRecip.id === oldRecip.id),
        ),
        ...recipients,
      ]);
      if (!draft) {
        setSelectedRecipient('');
        setSubject('');
        setMessageBody('');
        setCategory('');
      }
    },
    [recipients, draft],
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
          dispatch(sendMessage(sendData, true)).then(() => history.push('/'));
        } else {
          dispatch(sendMessage(JSON.stringify(messageData), false)).then(() =>
            history.push('/'),
          );
        }
      }
    },
    [sendMessageFlag, isSaving],
  );

  const recipientExists = recipientId => {
    return recipientsList.findIndex(item => +item.id === +recipientId) > -1;
  };

  // Populates form fields with recipients and categories
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

  if (draft && recipients && !formPopulated) populateForm();

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

    dispatch(saveDraft(formData, type, draftId));
  };

  // Validations
  const sendMessageHandler = () => {
    // TODO add GA event
    let errorCounter = 0;
    if (!selectedRecipient || selectedRecipient === '') {
      setRecipientError('Please select a recipient.');
      errorCounter += 1;
    }
    if (!subject || subject === '') {
      setSubjectError('Subject cannot be blank.');
      errorCounter += 1;
    }
    if (messageBody === '' || messageBody.match(/^[\s]+$/)) {
      setBodyError('Message body cannot be blank.');
      errorCounter += 1;
    }
    if (!category || category === '') {
      setCategoryError('Please select a category.');
      errorCounter += 1;
    }
    if (errorCounter === 0) {
      setSendMessageFlag(true);
    }
  };

  useEffect(
    () => {
      if (
        selectedRecipient &&
        category &&
        debouncedSubject &&
        debouncedMessageBody &&
        !sendMessageFlag
      ) {
        saveDraftHandler('auto');
      }
    },
    [
      attachmentNames,
      category,
      debouncedMessageBody,
      debouncedSubject,
      saveDraftHandler,
      selectedRecipient,
      sendMessageFlag,
    ],
  );

  return (
    <form className="compose-form">
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
        {recipientsList && (
          <>
            <VaSelect
              enable-analytics
              id="recipient-dropdown"
              label="To"
              name="to"
              value={selectedRecipient}
              onVaSelect={e => setSelectedRecipient(e.detail.value)}
              class="composeSelect"
              data-testid="compose-recipient-select"
              error={recipientError}
            >
              {sortRecipients(recipientsList)?.map(item => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </VaSelect>
            <button type="button" className="link-button edit-input-button">
              Edit List
            </button>
          </>
        )}
        <div className="compose-form-div">
          <CategoryInput
            category={category}
            categoryError={categoryError}
            setCategory={setCategory}
            setCategoryError={setCategoryError}
          />
        </div>
        <div className="compose-form-div">
          <va-text-input
            label="Subject"
            required
            type="text"
            id="message-subject"
            name="message-subject"
            className="message-subject"
            data-testid="message-subject-field"
            onInput={e => setSubject(e.target.value)}
            value={subject}
            error={subjectError}
          />
        </div>
        <div className="compose-form-div">
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
          <va-button
            text="Send"
            class="vads-u-flex--1"
            data-testid="Send-Button"
            onClick={sendMessageHandler}
          />

          <va-button
            text="Save draft"
            secondary
            class="vads-u-flex--1"
            data-testid="Save-Draft-Button"
            onClick={() => saveDraftHandler('manual')}
          />
          <div className="vads-u-flex--1 vads-u-display--flex">
            {draft && <DiscardDraft draft={draft} />}
          </div>
        </div>
      </div>
      <DraftSavedInfo />
    </form>
  );
};

ComposeForm.propTypes = {
  draft: PropTypes.object,
  recipients: PropTypes.array,
};

export default ComposeForm;
