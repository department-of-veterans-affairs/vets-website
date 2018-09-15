import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CallToActionWidget from '../../platform/site-wide/cta-widget';

export default function createCallToActionWidget(store) {
  const root = document.getElementById('cta-widget');

  if (root) {
    ReactDOM.render((
      <Provider store={store}>
        <CallToActionWidget requiredServices={root.dataset.requiredServices}/>
      </Provider>
    ), root);
  }
}
