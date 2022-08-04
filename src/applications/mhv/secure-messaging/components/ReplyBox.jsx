import React from 'react';
import {
  VaButton,
  VaTextarea,
  VaAdditionalInfo,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ReplyBox = () => (
  <div className="vads-l-row message-box vads-u-padding--0p25">
    <div className="vads-l-row">
      <h2 className="vads-l-col message-title">Test: Your lab results</h2>
      <div className="vads-l-col--2">
        <a
          href="http://localhost:3001/my-health/secure-messages/reply/"
          className="vads-u-text-align--right"
        >
          Send
        </a>
      </div>
    </div>
    <div className="vads-l-row message-body vads-u-padding--1p5">
      <div className="vads-l-row">
        <p>
          <strong>From: </strong>
          Lewis, Jennifer
        </p>
        <p>
          <strong>To: </strong>
          Dunwoody, Ann E. (My HealtheVet Questions_PugetSound_ADMIN)
        </p>
        <p>
          <strong>Date: </strong>
          August 16, 2021 at 1:32 p.m. ET
        </p>
        <p>
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

      <div className="vads-l-row message-body">
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
                x Remove
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

      <div className="vads-l-row message-body">
        <VaAdditionalInfo
          trigger="How to attach a file"
          disable-analytics={false}
          disable-border={false}
        />
      </div>

      <div className="vads-l-row message-body">
        <VaButton
          class="vads-u-width--full"
          text="Send"
          onClick={function noRefCheck() {}}
        />
      </div>
      <div className="vads-l-row message-body">
        <a
          className="vads-u-text-align--center"
          href="http://localhost:3001/my-health/secure-messages/reply/"
        >
          Save as Draft
        </a>
      </div>
    </div>
  </div>
);

export default ReplyBox;
