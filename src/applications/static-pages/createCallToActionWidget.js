import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '../../platform/site-wide/cta-widget/sass/cta-widget.scss';
import CallToActionWidget from '../../platform/site-wide/cta-widget';

export default function createCallToActionWidget(store) {
  const root = document.getElementById('cta-widget');

  if (root) {
    let { requiredServices } = root.dataset;

    requiredServices =
      requiredServices && new Set(requiredServices.split(' '));

    ReactDOM.render((
      <Provider store={store}>
        <CallToActionWidget requiredServices={requiredServices}/>
      </Provider>
    ), root);
  }
}
