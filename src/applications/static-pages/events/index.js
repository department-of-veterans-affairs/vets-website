import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import cookie from 'js-cookie';

import App from './components/App';
import { generateTestEvents } from './helpers/event-generator';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (root) {
    let rawEvents = [];

    if (cookie.get('useGeneratedTestEvents')) {
      // Use generated test events if the useGeneratedTestEvents cookie is set.
      rawEvents = generateTestEvents().sort(
        (event1, event2) =>
          event1?.fieldDatetimeRangeTimezone[0]?.value -
          event2?.fieldDatetimeRangeTimezone[0]?.value,
      );
    } else {
      const pastEvents = window?.pastEvents?.entities || [];
      const allEventTeasers = window?.allEventTeasers?.entities || [];
      rawEvents = [...pastEvents, ...allEventTeasers]?.sort(
        (event1, event2) =>
          event1?.fieldDatetimeRangeTimezone[0]?.value -
          event2?.fieldDatetimeRangeTimezone[0]?.value,
      );
    }

    ReactDOM.render(
      <Provider store={store}>
        <App rawEvents={rawEvents} />
      </Provider>,
      root,
    );
  }
};
