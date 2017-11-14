import '../common';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import initReact from '../common/init-react';

export default function createFeedbackWidget(store) {
  function init() {
    ReactDOM.render((
      <Provider store={store}>
        <h3>Footer</h3>
      </Provider>
    ), document.getElementById('feedback-root'));
  }

  initReact(init);
}
