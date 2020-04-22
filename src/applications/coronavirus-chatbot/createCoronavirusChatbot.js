import recordEvent from '../../platform/monitoring/record-event';
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
      initializeChatbot(root);
    })
    // eslint-disable-next-line no-unused-vars
    .then(res => {
      recordEvent({
        event: `${GA_PREFIX}-load-successful`,
      });
    })
    // eslint-disable-next-line no-unused-vars
    .catch(error => {
      recordEvent({
        event: `${GA_PREFIX}-load-failure`,
        'error-key': undefined,
      });
    });
};
