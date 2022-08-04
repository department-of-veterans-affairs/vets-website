import React, { useRef } from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import MessageCategory from './MessageCategory';

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
      />
      <button type="button" className="link-button edit-input-button">
        Edit List
      </button>

      <MessageCategory />

      <va-text-input
        label="Subject"
        name="subject"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        required
      />

      <va-textarea
        label="Message"
        name="message"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        required
      />

      <div>
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
        <div className="compose-attachments-input">
          <input
            type="file"
            id="composeAttachments"
            name="attachments"
            hidden
          />
          <label htmlFor="attachments">
            <i className="fas fa-paperclip" /> Attach files
          </label>
        </div>
        <VaAdditionalInfo
          trigger="How to attach a file"
          disable-analytics={false}
          disable-border={false}
        >
          <div>How to attach a file...</div>
        </VaAdditionalInfo>
      </div>

      <button type="button" className="send-button-bottom">
        <span className="send-button-bottom-text">Send</span>
        <i className="fas fa-paper-plane" />
      </button>
      <button type="button" className="link-button">
        Save as draft
      </button>
    </form>
  );
};

export default ComposeForm;
