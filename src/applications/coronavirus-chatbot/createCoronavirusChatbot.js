import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from './utils';
import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';
import ChatbotLoadError from './components/ChatbotLoadError';
import './sass/coronavirus-chatbot.scss';

export default (_store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  import(/* webpackChunkName: "chatbot" */ './index').then(async module => {
    const initializeChatbot = module.default;
    try {
      const webchatOptions = await initializeChatbot();
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
      window.WebChat.renderWebChat(webchatOptions, root);
    } catch (err) {
      ReactDOM.render(<ChatbotLoadError />, root);
      Sentry.captureException(err);
      recordEvent({
        event: `${GA_PREFIX}-connection-failure`,
        'error-key': 'XX_failed_to_start_chat',
      });
      recordEvent({
        event: `${GA_PREFIX}-load-failure`,
        'error-key': undefined,
      });
    }
  });
};
