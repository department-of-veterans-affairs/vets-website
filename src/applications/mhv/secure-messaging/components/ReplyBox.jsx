import React from 'react';
import {
  VaTextarea,
  VaAdditionalInfo,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ReplyBox = () => (
  <div className=" message-box vads-u-padding--0p25">
    <div className="vads-u-display--flex vads-u-flex-direction--row message-title">
      <h2 className="vads-u-margin-top--1 vads-u-margin-bottom--2">
        Test: Your lab results
      </h2>
      <button type="button" className="send-button-top">
        <i className="fas fa-paper-plane" />
        <span className="send-button-top-text">Send</span>
      </button>
    </div>

    <div className="message-body vads-u-padding--1p5">
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
      <VaTextarea
        label="Message"
        name="message-body"
        onBlur={function noRefCheck() {}}
        onInput={function noRefCheck() {}}
        placeholder=""
        required
      />

      <div className="message-body">
        <p className="message-body">Attachments</p>

        <div className="vads-l-row">
          <div className="vads-l-col--1">
            <i
              className="fa fa-paperclip attachment-icon"
              aria-label="Attached file"
            />
          </div>
          <div className="vads-l-col">
            <p className="message-body">
              {
                'This is an attachment that I uploaded from my laptop.pdf (108.7 KB) '
              }{' '}
              <a href="http://localhost:3001/my-health/secure-messages/reply/">
                <i className="fas fa-times" /> Remove
              </a>
            </p>
          </div>
        </div>

        <div className="vads-l-row">
          <div className="vads-l-col--1">
            <a href="http://localhost:3001/my-health/secure-messages/reply/">
              <i
                className="fa fa-paperclip attachment-icon"
                aria-label="Attached file"
              />
            </a>
          </div>
          <div className="vads-l-col">
            <a
              href="http://localhost:3001/my-health/secure-messages/reply/"
              className="message-body"
            >
              Attach files
            </a>
          </div>
        </div>
      </div>

      <div className="message-body">
        <VaAdditionalInfo
          trigger="How to attach a file"
          disable-analytics={false}
          disable-border={false}
        />
      </div>

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
);

export default ReplyBox;
