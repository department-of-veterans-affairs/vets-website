// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Related imports.
import App from './components/App';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (root) {
    // Derive the props to pass to the widget.
    const pastEvents = window?.pastEvents?.entities || [];
    const allEventTeasers = window?.allEventTeasers?.entities || [];

    const rawEvents = [...pastEvents, ...allEventTeasers]?.sort(
      (event1, event2) =>
        event1?.fieldDatetimeRangeTimezone[0]?.value -
        event2?.fieldDatetimeRangeTimezone[0]?.value,
    );

    ReactDOM.render(
      <Provider store={store}>
        <App rawEvents={rawEvents} />
      </Provider>,
      root,
    );
  }
};
