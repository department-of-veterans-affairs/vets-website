import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from './utils';

export default (_store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  import(/* webpackChunkName: "chatbot" */ './index')
    .then(module => {
      const initializeChatbot = module.default;
      initializeChatbot()
        .then(webchatOptions => {
          window.WebChat.renderWebChat(webchatOptions, root);
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
