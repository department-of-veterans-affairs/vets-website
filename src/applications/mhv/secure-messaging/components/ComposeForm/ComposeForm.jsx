import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { focusElement } from 'platform/utilities/ui';
import { useDispatch } from 'react-redux';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FileInput from './FileInput';
import CategoryInput from './CategoryInput';
import AttachmentsList from '../AttachmentsList';
import { saveDraft } from '../../actions/draftDetails';
import DraftSavedInfo from './DraftSavedInfo';
import useDebounce from '../../hooks/use-debounce';

const ComposeForm = props => {
  const { draft, recipients } = props;
  const dispatch = useDispatch();

  const defaultRecipientsList = [{ id: 0, name: ' ' }];
  const [recipientsList, setRecipientsList] = useState(defaultRecipientsList);
  const [selectedRecipient, setSelectedRecipient] = useState(
    defaultRecipientsList[0].id,
  );
  const [category, setCategory] = useState(null);
  const [categoryError, setCategoryError] = useState(null);
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [formPopulated, setFormPopulated] = useState(false);
  const [fieldsString, setFieldsString] = useState('');

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
    },
    [recipients],
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

  const sendMessageHandler = event => {
    event.preventDefault();

    if (!category) {
      setCategoryError(true);
      focusElement('.message-category');
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

    dispatch(saveDraft(formData, type, draftId));
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

  return (
    <form className="compose-form" onSubmit={sendMessageHandler}>
      <div className="compose-form-header">
        <h3>{setMessageTitle()}</h3>
        <button type="submit" className="send-button-top">
          <i className="fas fa-paper-plane" aria-hidden="true" />
          <span className="send-button-top-text">Send</span>
        </button>
      </div>
      <div className="compose-inputs-container">
        <VaSelect
          id="recipient-dropdown"
          label="To"
          name="to"
          value={selectedRecipient}
          onVaSelect={e => setSelectedRecipient(e.detail.value)}
          class="composeSelect"
          data-testid="compose-select"
        >
          {recipientsList.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </VaSelect>
        <button type="button" className="link-button edit-input-button">
          Edit List
        </button>
        <CategoryInput
          category={category}
          categoryError={categoryError}
          setCategory={setCategory}
          setCategoryError={setCategoryError}
        />
        <div className="message-subject-field">
          <label htmlFor="message-subject">
            Subject
            <span className="required"> (*Required)</span>
          </label>

          <input
            type="text"
            id="message-subject"
            name="message-subject"
            className="message-subject"
            data-testid="message-subject-field"
            onChange={e => {
              setSubject(e.target.value);
            }}
            value={subject}
          />
        </div>
        <div className="message-body-field">
          <label htmlFor="message-body">
            Message
            <span className="required"> (*Required)</span>
          </label>
          <textarea
            id="message-body"
            name="message-body"
            className="message-body"
            data-testid="message-body-field"
            onChange={e => setMessageBody(e.target.value)}
            value={messageBody}
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
        <div className="compose-form-actions">
          <button
            type="submit"
            className="send-button-bottom"
            data-testid="Send-Button"
          >
            Send
          </button>
          <button
            type="button"
            className="usa-button-secondary save-draft-button"
            data-testid="Save-Draft-Button"
            onClick={() => saveDraftHandler('manual')}
          >
            Save draft
          </button>
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
