import React, { useRef } from 'react';
import FileInput from './FileInput';
import MessageCategoryInput from './MessageCategoryInput';

const ComposeForm = () => {
  useRef();

  return (
    <form className="compose-form">
      <va-text-input
        label="To"
        name="to"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        required
        class="composeInput"
      />
      <button type="button" className="link-button edit-input-button">
        Edit List
      </button>

      <MessageCategoryInput />

      <va-text-input
        label="Subject"
        name="subject"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        required
        class="composeInput"
      />

      <div className="message-field">
        <label htmlFor="message">
          Message
          <span className="required"> (*Required)</span>
        </label>
        <textarea id="message" name="message" className="message" />
      </div>

      <section className="attachments-section">
        <label htmlFor="compose_attachments">Attachments</label>

        <ul className="compose-attachments-list">
          <li>
            <i className="fas fa-paperclip" />
            <div>
              This is an attachment that I uploaded from my laptop.pdf (108.7
              KB)
              <button
                type="button"
                className="link-button remove-attachment-button"
              >
                <i className="fas fa-times" />
                Remove
              </button>
            </div>
          </li>
        </ul>

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
  );
};

export default ComposeForm;
