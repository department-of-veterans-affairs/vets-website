import React from 'react';
import NavigationLinks from '../components/NavigationLinks';
import MessageActionButtons from '../components/MessageActionsButtons';
import OlderMessages from '../components/OlderMessages';

const MessageDetail = () => {
  const from = 'Dunwoody, Ann E. (My HealtheVet Questions_PugetSound_ADMIN)';
  const to = 'Lewis, Jennifer';
  const messageDate = 'August 15, 2021, 1:32 p.m. ET';
  const messageId = '8675309';
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
        <a href="/messages" className="breadcrumb">
          <i className="fas fa-angle-left" />
          Messages
        </a>
        <button
          type="button"
          className="vads-u-margin-top--2 usa-button-secondary messages-nav-menu"
        >
          <span>In the Messages section</span>
          <i className="fas fa-bars" />
        </button>
      </nav>

      <h1 className="vads-u-margin-top--2">Messages</h1>

      <NavigationLinks />

      <section className="message-detail-block">
        <div className="vads-u-display--flex vads-u-flex-direction--row message-detail-header">
          <h3 className="vads-u-margin-top--1 vads-u-margin-bottom--2">
            Test: Your lab results
          </h3>
          <button type="button" className="send-button-top">
            <i className="fas fa-reply" />
            <span className="reply-button-top-text">Reply</span>
          </button>
        </div>

        <div className="message-detail-content">
          <div className="message-metadata">
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
          </div>
          <div className="message-body">{messageText()}</div>

          <div className="message-attachments">
            <p>
              <strong>Attachments</strong>
            </p>

            <div className="vads-l-row">
              <div className="vads-l-col--1">
                <i
                  className="fa fa-paperclip attachment-icon"
                  aria-label="Attached file"
                />
              </div>
              <div className="vads-l-col">
                <a href="/message">
                  {
                    'This is an attachment that I uploaded from my laptop.pdf (108.7 KB) '
                  }{' '}
                </a>
              </div>
            </div>
          </div>

          <div className="message-detail-note">
            <p>
              <i>
                Note: This message may not be from the person you intially
                contacted. It may have been reassigned to efficiently address
                your original message
              </i>
            </p>
          </div>

          <MessageActionButtons />
        </div>
      </section>
      <OlderMessages />
    </div>
  );
};

export default MessageDetail;
