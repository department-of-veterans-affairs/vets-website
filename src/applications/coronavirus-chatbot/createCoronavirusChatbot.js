import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import initializeChatbot from './index';
import recordEvent from '../../platform/monitoring/record-event';
import { GA_PREFIX } from './utils';

export default (store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }
  // webpackChunkName: "chatbot"
  import('./chatbot-entry')
    .then(module => {
      const { CoronavirusChatbot } = module.default;
      initializeChatbot()
        .then(webchatOptions => {
          ReactDOM.render(
            <Provider store={store}>
              <CoronavirusChatbot config={webchatOptions} />
            </Provider>,
            root,
          );
        })
        .then(
          recordEvent({
            event: `${GA_PREFIX}-connection-successful`,
            'error-key': undefined,
          }),
        )
        .catch(() => {
          recordEvent({
            event: `${GA_PREFIX}-connection-failure`,
            'error-key': 'XX_failed_to_start_chat',
          });
        });
    })
    .then(() => {
      recordEvent({
        event: `${GA_PREFIX}-load-successful`,
        'error-key': undefined,
      });
    })
    .catch(() => {
      recordEvent({
        event: `${GA_PREFIX}-load-failure`,
        'error-key': undefined,
      });
    });
};
