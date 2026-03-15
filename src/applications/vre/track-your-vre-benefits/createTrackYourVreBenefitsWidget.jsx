import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reducer from './reducers';

export { reducer as trackYourVreBenefitsReducer };

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (!root) {
    return;
  }

  import(/* webpackChunkName: "track-your-vre-benefits-widget" */ './containers/ServiceAvailabilityBanner').then(
    module => {
      const ServiceAvailabilityBanner = module.default;

      ReactDOM.render(
        <Provider store={store}>
          <ServiceAvailabilityBanner />
        </Provider>,
        root,
      );
    },
  );
};
