import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import FileInput from './FileInput';
import MessageCategoryInput from './MessageCategoryInput';
import AttachmentsList from './AttachmentsList';

const ComposeForm = props => {
  const { message } = props;
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
    const casedCategory = capitalize(category);
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

  const handleMessageBodyChange = e => {
    setMessageBody(e.target.value);
  };

  return (
    <section className="compose-form-container">
      <div className="compose-header">
        <h3>{setMessageTitle()}</h3>
        <button type="button" className="send-button-top">
          <i className="fas fa-paper-plane" />
          <span className="send-button-top-text">Send</span>
        </button>
      </div>

      <form className="compose-form">
        <va-select
          // eslint-disable-next-line jsx-a11y/aria-props
          aria-live-region-text="You selected"
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

        <MessageCategoryInput category={category} setCategory={setCategory} />

        <va-text-input
          label="Subject"
          name="subject"
          onBlur={function noRefCheck() {}}
          onInput={function noRefCheck() {}}
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
          <div className="compose-attachments-label">Attachments</div>
          <AttachmentsList attachments={attachments} />

          <FileInput />
        </section>

        <div className="compose-form-actions">
          <button type="button" className="send-button-bottom">
            <span className="send-button-bottom-text">Send</span>
            <i className="fas fa-paper-plane" />
          </button>
          <button type="button" className="link-button save-draft-button">
            Save as draft
          </button>
        </div>
      </form>
    </section>
  );
};

ComposeForm.propTypes = {
  message: PropTypes.object,
};

export default ComposeForm;
