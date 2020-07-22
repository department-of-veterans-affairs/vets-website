import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';

export const GA_PREFIX = 'chatbot';

export const addLinkClickListener = () => {
  const root = document.getElementById('webchat');
  root.addEventListener('click', event => {
    if (event.target.tagName.toLowerCase() === 'a') {
      recordEvent({
        event: `${GA_PREFIX}-resource-link-click`,
        'error-key': undefined,
      });
    }
  });
};

export const recordButtonClick = () => {
  recordEvent({
    event: `${GA_PREFIX}-button-click`,
    'error-key': undefined,
  });
};

export const recordChatbotSuccess = () => {
  recordEvent({
    event: `${GA_PREFIX}-connection-successful`,
    'error-key': undefined,
  });
  recordEvent({
    event: `${GA_PREFIX}-load-successful`,
    'error-key': undefined,
  });
};

export const recordChatbotFailure = error => {
  Sentry.captureException(error);
  recordEvent({
    event: `${GA_PREFIX}-connection-failure`,
    'error-key': 'XX_failed_to_start_chat',
  });
  recordEvent({
    event: `${GA_PREFIX}-load-failure`,
    'error-key': undefined,
  });
};

export const recordInitChatbotFailure = error => {
  Sentry.captureException(error);
  recordEvent({
    event: `${GA_PREFIX}-connection-failure`,
    'error-key': 'XX_failed_to_init_bot_convo',
  });
};
