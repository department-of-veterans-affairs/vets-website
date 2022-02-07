// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default async (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (root) {
    // Derive the props to pass to the widget.
    const pastEvents = window?.pastEvents?.entities || [];
    const allEventTeasers = window?.allEventTeasers?.entities || [];
    const rawEvents = [...pastEvents, ...allEventTeasers]?.sort(
      (event1, event2) =>
        event1?.fieldDatetimeRangeTimezone?.value -
        event2?.fieldDatetimeRangeTimezone?.value,
    );
    const {
      App,
    } = await import(/* webpackChunkName: "events" */ './components/App');
    ReactDOM.render(
      <Provider store={store}>
        <App rawEvents={rawEvents} />
      </Provider>,
      root,
    );
  }
};
