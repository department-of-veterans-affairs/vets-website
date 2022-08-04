import React, { useRef } from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
      />

      <va-textarea
        label="Message"
        name="message"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        required
      />

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

        <div className="compose-attachments-input">
          <input type="file" id="attachments" name="attachments" hidden />
          <label htmlFor="attachments">
            <i className="fas fa-paperclip" />
            Attach files
          </label>
        </div>
        <VaAdditionalInfo
          trigger="How to attach a file"
          disable-analytics={false}
          disable-border={false}
        >
          <ol className="how-to-attach-files">
            <li>1. Click "Attach files" above.</li>
            <li>2. Browse local machine to find file.</li>
            <li>3. Click "open"</li>
            <li>
              4. You should now see your file in list of attachments above.
            </li>
          </ol>
        </VaAdditionalInfo>
      </section>

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
