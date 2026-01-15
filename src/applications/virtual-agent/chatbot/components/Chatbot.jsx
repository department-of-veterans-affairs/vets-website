import {
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  // eslint-disable-next-line camelcase
  unstable_convertExternalMessages,
  useAssistantApi,
  useAssistantState,
  useAssistantTransportRuntime,
} from '@assistant-ui/react';
import { DevToolsModal } from '@assistant-ui/react-devtools';
import React from 'react';

import Disclaimer from '../../shared/components/Disclaimer/Disclaimer';
import useSkipLinkFix from '../../shared/hooks/useSkipLinkFix';

const LANGGRAPH_API_URL = 'http://127.0.0.1:2024';

const coerceRole = message => {
  if (!message) return 'assistant';
  if (message.role === 'user' || message.role === 'assistant')
    return message.role;
  if (message.role === 'system') return 'system';

  switch (message.type) {
    case 'human':
      return 'user';
    case 'ai':
      return 'assistant';
    case 'system':
      return 'system';
    default:
      return 'assistant';
  }
};

const coercePart = part => {
  if (!part) return null;
  if (typeof part === 'string') {
    return { type: 'text', text: part };
  }

  if (part.type === 'text' && typeof part.text === 'string') {
    return { type: 'text', text: part.text };
  }

  if (typeof part.text === 'string') {
    return { type: 'text', text: part.text };
  }

  if (typeof part.content === 'string') {
    return { type: 'text', text: part.content };
  }

  return null;
};

const coerceContent = content => {
  if (Array.isArray(content)) {
    return content.map(coercePart).filter(Boolean);
  }

  if (typeof content === 'string') {
    return [{ type: 'text', text: content }];
  }

  if (content && typeof content.text === 'string') {
    return [{ type: 'text', text: content.text }];
  }

  if (content) {
    return [{ type: 'text', text: String(content) }];
  }

  return [];
};

const coerceMessage = message => {
  if (typeof message === 'string') {
    return {
      role: 'assistant',
      content: [{ type: 'text', text: message }],
    };
  }

  const role = coerceRole(message);
  const content =
    message?.content ??
    message?.text ??
    message?.parts ??
    message?.message ??
    '';

  return {
    role,
    content: coerceContent(content),
  };
};

const coerceMessages = state => {
  if (Array.isArray(state)) return state.map(coerceMessage);
  if (Array.isArray(state?.messages)) return state.messages.map(coerceMessage);
  return [];
};

const coercePendingMessages = pendingCommands => {
  return pendingCommands
    .filter(command => command.type === 'add-message')
    .map(command => ({
      role: command.message.role,
      content: (command.message.parts || []).map(coercePart).filter(Boolean),
    }));
};

const useMessageText = () =>
  useAssistantState(({ message }) => {
    if (!message?.content?.length) return '';
    return message.content
      .filter(part => part.type === 'text' && part.text)
      .map(part => part.text)
      .join('');
  });

const UserMessage = () => {
  const text = useMessageText();

  return (
    <MessagePrimitive.Root className="vads-u-margin-y--1 vads-u-display--flex vads-u-justify-content--flex-end">
      <div className="vads-u-background-color--primary vads-u-color--white vads-u-padding--1p5 vads-u-border-radius--md vads-u-display--inline-block">
        <p className="vads-u-margin--0 vads-u-line-height--4">{text}</p>
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantMessage = () => {
  const text = useMessageText();

  return (
    <MessagePrimitive.Root className="vads-u-margin-y--1 vads-u-display--flex vads-u-justify-content--flex-start">
      <div className="vads-u-background-color--gray-lightest vads-u-padding--1p5 vads-u-border-radius--md vads-u-display--inline-block">
        <p className="vads-u-margin--0 vads-u-line-height--4">{text}</p>
      </div>
    </MessagePrimitive.Root>
  );
};

const ChatComposer = () => {
  const api = useAssistantApi();
  const text = useAssistantState(
    ({ composer }) => (composer.isEditing ? composer.text : ''),
  );
  const isRunning = useAssistantState(({ thread }) => thread.isRunning);
  const canSend = useAssistantState(
    ({ composer, thread }) =>
      !thread.isRunning && composer.isEditing && !composer.isEmpty,
  );

  return (
    <ComposerPrimitive.Root className="vads-u-margin-top--2">
      <div className="vads-u-display--flex vads-u-align-items--flex-end">
        <va-text-input
          label="Your message"
          name="chatbot-message"
          placeholder="Type your message"
          value={text}
          onInput={event => {
            api.composer().setText(event.target.value);
          }}
          disabled={isRunning}
          className="vads-u-width--full"
        />
        <va-button
          onClick={() => {
            if (canSend) api.composer().send();
          }}
          disabled={!canSend}
          className="vads-u-margin-left--1"
          text="Send"
        />
      </div>
    </ComposerPrimitive.Root>
  );
};

export const Chatbot = () => {
  useSkipLinkFix();
  const runtime = useAssistantTransportRuntime({
    api: LANGGRAPH_API_URL,
    protocol: 'assistant-transport',
    headers: {
      'Content-Type': 'application/json',
    },
    initialState: {
      messages: [],
    },
    converter: (state, connectionMetadata) => {
      const baseMessages = coerceMessages(state);
      const pendingMessages = coercePendingMessages(
        connectionMetadata.pendingCommands,
      );
      const isRunning = Boolean(
        state?.isRunning || connectionMetadata.isSending,
      );

      return {
        messages: unstable_convertExternalMessages(
          [...baseMessages, ...pendingMessages],
          message => message,
          isRunning,
          {
            toolStatuses: connectionMetadata.toolStatuses,
          },
        ),
        state,
        isRunning,
      };
    },
  });

  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5">
          <div className="vads-u-padding--1p5 vads-u-background-color--gray-lightest">
            <div className="vads-u-background-color--primary-darker vads-u-padding--1p5">
              <h3 className="vads-u-font-size--lg vads-u-color--white vads-u-margin--0">
                V2 Chatbot
              </h3>
            </div>
            <div className="vads-u-background-color--white vads-u-border--1px vads-u-border-color--gray-lighter vads-u-padding--2">
              <AssistantRuntimeProvider runtime={runtime}>
                <DevToolsModal />
                <ThreadPrimitive.Root className="vads-u-display--flex vads-u-flex-direction--column">
                  <ThreadPrimitive.Viewport className="vads-u-overflow-y--auto vads-u-padding-bottom--1">
                    <ThreadPrimitive.Empty>
                      <p className="vads-u-margin--0 vads-u-color--gray-medium">
                        Ask a question to get started.
                      </p>
                    </ThreadPrimitive.Empty>
                    <ThreadPrimitive.Messages
                      components={{
                        UserMessage,
                        AssistantMessage,
                      }}
                    />
                    <ThreadPrimitive.ViewportFooter className="vads-u-margin-top--2">
                      <ChatComposer />
                    </ThreadPrimitive.ViewportFooter>
                  </ThreadPrimitive.Viewport>
                </ThreadPrimitive.Root>
              </AssistantRuntimeProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
