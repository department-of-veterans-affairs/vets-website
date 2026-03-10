import { VaTextarea } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    const text = value.trim();
    if (!text) {
      setError('Please enter a message');
      return;
    }
    setError(null);
    sendMessage(text);
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form
      className="vads-u-display--flex vads-u-align-items--flex-end vads-u-padding--1p5 vads-u-border-top--1px vads-u-border-color--gray-light"
      data-testid="chat-input-form"
      onSubmit={handleSubmit}
    >
      <div className="vads-u-flex--1 vads-u-margin-right--1">
        <VaTextarea
          error={error}
          ref={inputRef}
          data-testid="chat-input"
          name="chat-message"
          value={value}
          placeholder="Type your message"
          maxlength={500}
          charcount
          onInput={e => {
            setValue(e.target.value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
        />
      </div>
      <va-button
        data-testid="chat-send-button"
        text="Send"
        onClick={handleSubmit}
      />
    </form>
  );
}

ChatInput.propTypes = {
  sendMessage: PropTypes.func.isRequired,
};
