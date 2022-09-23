import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { focusElement } from 'platform/utilities/ui';
import { useDispatch, useSelector } from 'react-redux';
import FileInput from './FileInput';
import MessageCategoryInput from './MessageCategoryInput';
import AttachmentsList from './AttachmentsList';
import { saveDraft } from '../actions/index';

const ComposeForm = props => {
  const { message } = props;
  const dispatch = useDispatch();
  const { isSaving, lastSaveTime, error } = useSelector(state => state.message);

  const defaultRecipientsList = [
    { id: 0, name: ' ' },
    { id: 1, name: 'Doctor A' },
    { id: 2, name: 'Doctor B' },
    { id: 3, name: 'Doctor C' },
  ];
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

  const recipientExists = recipientId => {
    return recipientsList.findIndex(item => +item.id === +recipientId) > -1;
  };

  const populateForm = () => {
    if (!recipientExists(message.recipientId)) {
      const newRecipient = {
        id: message.recipientId,
        name: message.recipientName,
      };
      setRecipientsList(prevRecipientsList => [
        ...prevRecipientsList,
        newRecipient,
      ]);
      setSelectedRecipient(newRecipient.id);
    }
    setCategory(message.category);
    setSubject(message.subject);
    setMessageBody(message.body);
    if (message.attachments.attachment.length) {
      setAttachments(message.attachments.attachment);
    }
    setFormPopulated(true);
  };

  if (message && !formPopulated) populateForm();

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

  const aggregateFormData = () => {
    const formData = new FormData();

    formData.append('recipientId', selectedRecipient);
    formData.append('category', category);
    formData.append('subject', subject);
    formData.append('body', messageBody);

    for (const file of attachments) {
      formData.append(file.name, file);
    }

    return formData;
  };

  const handleMessageBodyChange = e => {
    setMessageBody(e.target.value);
  };

  const handleSubjectChange = e => {
    setSubject(e.target.value);
  };

  const sendMessageHandler = event => {
    event.preventDefault();

    if (!category) {
      setCategoryError(true);
      focusElement('.message-category');
    }
  };

  const saveDraftHandler = () => {
    const draftData = aggregateFormData();

    dispatch(saveDraft(draftData));
  };

  const draftSaveMessageContentMobile = () => {
    if (isSaving) return <div className="last-save-time">Saving...</div>;
    if (error)
      return (
        <div className="last-save-time">
          <va-alert
            background-only
            class="last-save-time"
            disable-analytics="false"
            full-width="false"
            show-icon
            status="error"
            visible="true"
          >
            <p className="vads-u-margin-y--0">
              Something went wrong... Failed to save message.
            </p>
          </va-alert>
        </div>
      );
    if (lastSaveTime) {
      const today = new Date(lastSaveTime);
      const month = `0${today.getMonth() + 1}`.slice(-2);
      const day = today.toLocaleString('en-US', { day: '2-digit' });
      const year = today
        .getFullYear()
        .toString()
        .substring(2);
      const time = today.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return (
        <va-alert
          background-only
          class="last-save-time"
          disable-analytics="false"
          full-width="false"
          show-icon
          status="success"
          visible="true"
        >
          <p className="vads-u-margin-y--0">
            You’re message has been saved. Last save at {month}/{day}/{year} at{' '}
            {time}
          </p>
        </va-alert>
      );
    }
    return '';
  };

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
        <va-select
          label="To"
          name="to"
          value={selectedRecipient}
          class="composeSelect"
        >
          {recipientsList.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </va-select>

        <button type="button" className="link-button edit-input-button">
          Edit List
        </button>

        <MessageCategoryInput
          category={category}
          categoryError={categoryError}
          setCategory={setCategory}
          setCategoryError={setCategoryError}
        />

        <va-text-input
          label="Subject"
          name="subject"
          onInput={handleSubjectChange}
          required
          class="composeInput"
          value={subject}
        />

        <div className="message-body-field">
          <label htmlFor="message-body">
            Message
            <span className="required"> (*Required)</span>
          </label>
          <textarea
            id="message-body"
            name="message-body"
            className="message-body"
            onChange={handleMessageBodyChange}
            value={messageBody}
          />
        </div>

        <section className="attachments-section">
          <div className="compose-attachments-label">
            <strong>Attachments</strong>
          </div>
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
          <button type="submit" className="send-button-bottom">
            Send
          </button>
          <button
            type="button"
            className="usa-button-secondary save-draft-button"
            onClick={saveDraftHandler}
          >
            Save draft
          </button>
        </div>
      </div>

      {draftSaveMessageContentMobile()}
    </form>
  );
};

ComposeForm.propTypes = {
  message: PropTypes.object,
};

export default ComposeForm;
