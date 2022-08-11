import React from 'react';

const MessageActionButtons = () => {
  return (
    <div className="message-action-buttons vads-u-display--flex vads-u-flex-direction--row">
      <button type="button" className="message-action-button vads-u-flex--1">
        <i className="fas fa-print" />
        <span className="message-action-button-text">Print</span>
      </button>

      <button type="button" className="message-action-button vads-u-flex--1">
        <i className="fas fa-trash-alt" />
        <span className="message-action-button-text">Delete</span>
      </button>

      <button type="button" className="message-action-button vads-u-flex--1">
        <i className="fas fa-folder" />
        <span className="message-action-button-text">Move</span>
      </button>

      <button type="button" className="message-action-button vads-u-flex--1">
        <i className="fas fa-reply" />
        <span className="message-action-button-text">Reply</span>
      </button>
    </div>
  );
};

export default MessageActionButtons;
