import React from 'react';

function ListeningToMessages() {
  return (
    <>
      <li>
        Press <b>Tab</b> until the "Start chat" button is in focus and press{' '}
        <b>Enter</b>.
      </li>
      <li>Use the arrow keys to listen to the chatbot messages.</li>
    </>
  );
}

function AskingAQuestion() {
  return (
    <>
      <li>
        Press <b>Tab</b> to select the "Type your message" section.
      </li>
      <li>
        Ask your question and press <b>Enter</b>.
      </li>
    </>
  );
}

function SelectingAMessage() {
  return (
    <>
      <li>
        Press <b>Shift+Tab</b> to go back to messages.
      </li>
      <li>Use the arrow keys to focus on a specific message.</li>
    </>
  );
}

function UsingLinks() {
  return (
    <>
      <li>
        Press <b>Enter</b> to focus on a link.
      </li>
      <li>
        Press <b>Enter</b> to open a link. The link will open on another page.
      </li>
    </>
  );
}

function Exiting() {
  return (
    <>
      <li>
        Press <strong>Escape</strong> to leave the current message.
      </li>
      <li>
        Press <b>Shift+Tab</b> to exit the chatbot window.
      </li>
    </>
  );
}

export default function ScreenReader() {
  return (
    <>
      <h4 slot="headline">How to use our chatbot with a screen reader</h4>
      <p>
        If you’re blind or have low vision, follow these steps to use our
        chatbot on a desktop computer with a screen reader:
      </p>

      <ol>
        <ListeningToMessages />
        <AskingAQuestion />
        <SelectingAMessage />
        <UsingLinks />
        <Exiting />
      </ol>

      <p>
        <b>Note:</b> We’re currently in beta testing. Thank you for your
        patience as we work to make our chatbot easier to use.
      </p>
    </>
  );
}
