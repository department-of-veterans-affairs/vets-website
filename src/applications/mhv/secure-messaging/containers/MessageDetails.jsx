import React from 'react';
import NavigationLinks from '../components/NavigationLinks';
import MessageActionButtons from '../components/MessageActionsButtons';
import OlderMessages from '../components/OlderMessages';
import Breadcrumbs from '../components/rename';

const MessageDetail = () => {
  const from = 'Dunwoody, Ann E. (My HealtheVet Questions_PugetSound_ADMIN)';
  const to = 'Lewis, Jennifer';
  const messageDate = 'August 15, 2021, 1:32 p.m. ET';
  const messageId = '8675309';
  const subject = 'Test: Your lab results';
  const messageText = () => {
    return (
      <>
        <p>Hello,</p>
        <br />
        <p>
          This is a message that you have received from your helathcare team.
        </p>
        <br />
        <p>
          These are some details about the topic pertaining to your situation.
          Here are the actions you should take to progress in your treatment.
        </p>
        <br />
        <p>
          If you do not achieve the result you hope for, we will perform
          additional tasks.
        </p>
        <br />
        <p>Dr. Doctor</p>
      </>
    );
  };

  return (
    <div className="vads-l-grid-container vads-u-margin-top--2 message-detail-container">
      <nav>
        <Breadcrumbs
          pageName="Message"
          link="http://localhost:3001/my-health/secure-messages/message"
        />
        <button
          type="button"
          className="vads-u-margin-top--2 usa-button-secondary section-guide-button medium-screen:vads-u-display--none"
        >
          <span>In the Messages section</span>
          <i className="fas fa-bars" />
        </button>
      </nav>

      <h1 className="vads-u-margin-top--2">Messages</h1>

      <NavigationLinks />

      <section className="message-detail-block">
        <header className="vads-u-display--flex vads-u-flex-direction--row message-detail-header">
          <h2
            className="vads-u-margin-top--1 vads-u-margin-bottom--2"
            aria-label={`Message subject. ${subject}`}
          >
            {subject}
          </h2>
          <button
            type="button"
            className="send-button-top medium-screen:vads-u-padding-right--2"
          >
            <i className="fas fa-reply" />
            <span className="reply-button-top-text">Reply</span>
          </button>
        </header>

        <main className="message-detail-content">
          <section className="message-metadata" aria-label="message details.">
            <p>
              <strong>From: </strong>
              {from}
            </p>
            <p>
              <strong>To: </strong>
              {to}
            </p>
            <p>
              <strong>Date: </strong>
              {messageDate}
            </p>
            <p>
              <strong>Message ID: </strong>
              {messageId}
            </p>
          </section>
          <section className="message-body" aria-label="Message body.">
            {messageText()}
          </section>

          <div className="message-attachments">
            <p>
              <strong>Attachments</strong>
            </p>

            <div className="vads-u-display--flex vads-u-justify-content--flex-start">
              <div className="vads-u-padding-right--1">
                <i className="fa fa-paperclip attachment-icon" />
              </div>
              <div className="">
                <a href="/message">
                  {
                    'This is an attachment that I uploaded from my laptop.pdf (108.7 KB) '
                  }{' '}
                </a>
              </div>
            </div>
          </div>

          <div className="message-detail-note vads-u-text-align--center">
            <p>
              <i>
                Note: This message may not be from the person you intially
                contacted. It may have been reassigned to efficiently address
                your original message
              </i>
            </p>
          </div>

          <MessageActionButtons />
        </main>
      </section>
      <OlderMessages />
    </div>
  );
};

export default MessageDetail;
