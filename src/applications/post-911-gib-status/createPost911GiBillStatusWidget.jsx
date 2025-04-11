// Dependencies.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Relative imports.
import reducer from './reducers';

export { reducer as post911GIBillStatusReducer };

export default (store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  import(
    /* webpackChunkName: "gibs-status-availability-widget" */ './containers/ServiceAvailabilityBanner'
  ).then(module => {
    const ServiceAvailabilityBanner = module.default;
    ReactDOM.render(
      <Provider store={store}>
        <ServiceAvailabilityBanner />
      </Provider>,
      root,
    );
  });
};
