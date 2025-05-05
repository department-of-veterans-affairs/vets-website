import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createDisabilityRatingCalculator(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(
      /* webpackChunkName: "disability-rating-calculator" */
      './calculator-entry'
    ).then(module => {
      const { DisabilityRatingCalculator } = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <DisabilityRatingCalculator />
        </Provider>,
        root,
      );
    });
  }
}
