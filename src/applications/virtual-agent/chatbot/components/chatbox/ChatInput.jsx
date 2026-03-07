import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

/**
 * @typedef {Object} ChatInputProps
 * @property {function(string): void} sendMessage - Callback invoked with the trimmed message text on submit
 */

/**
 * Text input bar at the bottom of the chatbox.
 * Calls sendMessage on form submit and clears the field afterward.
 * @component
 * @param {ChatInputProps} props
 * @returns {JSX.Element}
 */
export default function ChatInput({ sendMessage }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    sendMessage(text);
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      className="vads-u-display--flex vads-u-align-items--flex-end vads-u-padding--1p5"
      data-testid="chat-input-form"
      onSubmit={handleSubmit}
    >
      <div className="vads-u-flex--1 vads-u-margin-right--1">
        <va-text-input
          ref={inputRef}
          data-testid="chat-input"
          label="Type a message"
          name="chat-message"
          value={value}
          onInput={e => setValue(e.target.value)}
        />
      </div>
      <va-button
        data-testid="chat-send-button"
        disabled={!value.trim()}
        text="Send"
        onClick={handleSubmit}
      />
    </form>
  );
}

ChatInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
};
