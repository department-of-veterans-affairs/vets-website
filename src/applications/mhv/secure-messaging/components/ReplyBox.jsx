import React from 'react';
import HowToAttachFiles from './HowToAttachFiles';

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
        <HowToAttachFiles />
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
