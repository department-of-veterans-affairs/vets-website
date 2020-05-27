import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from '../utils';
import ChatbotLoadError from './ChatbotLoadError';
import * as Sentry from '@sentry/browser';
import * as IndexModule from '../index';

const idString = 'chatbot-wrapper-id';

export class ChatbotComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatbotError: false,
    };
  }

  async componentDidMount() {
    const initialComponent = document.querySelector(`#${idString}`);
    try {
      const webchatOptions = await IndexModule.initializeChatbot();
      if (!webchatOptions) {
        return;
      }
      recordEvent({
        event: `${GA_PREFIX}-connection-successful`,
        'error-key': undefined,
      });
      recordEvent({
        event: `${GA_PREFIX}-load-successful`,
        'error-key': undefined,
      });
      window.WebChat.renderWebChat(webchatOptions, initialComponent);
    } catch (err) {
      Sentry.captureException(err);
      recordEvent({
        event: `${GA_PREFIX}-connection-failure`,
        'error-key': 'XX_failed_to_start_chat',
      });
      recordEvent({
        event: `${GA_PREFIX}-load-failure`,
        'error-key': undefined,
      });
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        chatbotError: true,
      });
    }
  }

  render() {
    if (this.state.chatbotError) {
      return <ChatbotLoadError />;
    }
    return <div id={idString} />;
  }
}
