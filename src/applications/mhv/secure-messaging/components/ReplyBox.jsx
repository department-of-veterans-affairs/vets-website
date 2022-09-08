import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ReplyBox = () => (
  <div className=" message-box vads-u-padding--0p25">
    <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center message-title medium-screen:vads-u-padding-x--4">
      <h2 className="vads-u-margin-top--1 vads-u-margin-bottom--2">
        Test: Your lab results
      </h2>
      <button type="button" className="send-button-top">
        <i className="fas fa-paper-plane" />
        <span className="send-button-top-text">Send</span>
      </button>
    </div>

    <div className="message-body vads-u-padding--1p5 medium-screen:vads-u-padding--4">
      <div className="message-body-text">
        <p className="message-body-text">
          <strong>From: </strong>
          Lewis, Jennifer
        </p>
        <p className="message-body-text">
          <strong>To: </strong>
          Dunwoody, Ann E. (My HealtheVet Questions_PugetSound_ADMIN)
        </p>
        <p className="message-body-text">
          <strong>Date: </strong>
          August 16, 2021 at 1:32 p.m. ET
        </p>
        <p className="message-body-text">
          <strong>Message ID: </strong>
          8675309
        </p>
      </div>

      <div>
        <p className="vads-u-margin-bottom--0p5">
          Message{' '}
          <span className="vads-u-color--secondary-dark">(*Required)</span>
        </p>
        <textarea className="message-input" id="Message" name="message" />
      </div>

      <div className="message-body">
        <p className="message-body">Attachments</p>

        <p className="message-body-text">
          <i
            className="fa fa-paperclip attachment-icon"
            aria-label="Attached file"
          />
          {
            'This is an attachment that I uploaded from my laptop.pdf (108.7 KB) '
          }{' '}
          <a href="http://localhost:3001/my-health/secure-messages/reply/">
            <i className="fas fa-times" /> Remove
          </a>
        </p>
        <p className="message-body-text">
          <a href="http://localhost:3001/my-health/secure-messages/reply/">
            <i
              className="fa fa-paperclip attachment-icon"
              aria-label="Attached file"
            />
            <span>Attach files</span>
          </a>
        </p>
      </div>

      <div className="message-body">
        <VaAdditionalInfo
          trigger="How to attach a file"
          disable-analytics={false}
          disable-border={false}
        >
          <ul>
            <li>
              Select the 'Attach files' link on the message you are editing
            </li>
            <li>Select the file you would like to attach</li>
            <li>Select the 'Attach' button</li>
          </ul>
          <p>
            <strong>Attachment Requirements:</strong>
          </p>
          <ul>
            <li>You may attach up to 4 files</li>
            <li>
              Files supported: doc, docx, gif, jpg, pdf, png, rtf, txt, xls,
              xlsx
            </li>
            <li>
              File size for a single attachment cannot exceed 6MB and the total
              size of all attachments cannot exceed 10MB
            </li>
          </ul>
          <p>
            <strong>
              Note: If you are unable to attach a document to a Secure Message:
            </strong>
          </p>
          <ul>
            <li>
              Confirm that your document meets the requirements for size and
              type
            </li>
            <li>
              Check your browser settings to be sure JavaScript is enabled
            </li>
            <li>Use a browser such as Chrome or Firefox</li>
            <li>
              If your problem persists, please contact the My HealtheVet{' '}
              <va-telephone international contact="8773270022">
                Help Desk
              </va-telephone>
            </li>
          </ul>
        </VaAdditionalInfo>
      </div>

      <div className="small-screen:vads-u-display--flex small-screen:vads-u-flex-direction--row-reverse small-screen:vads-u-justify-content--space-between">
        <div>
          <button type="button">
            <span className="save-button-text">{'Send '}</span>
            <i className="fas fa-paper-plane" />
          </button>
        </div>
        <div>
          <button type="button" className="save-button">
            <span className="save-button-text">Save as draft</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ReplyBox;
