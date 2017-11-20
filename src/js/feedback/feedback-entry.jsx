import '../common';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Main from './containers/Main';
import initReact from '../common/init-react';

export default function createFeedbackWidget(store) {
  function init() {
    ReactDOM.render((
      <Provider store={store}>
        <Main/>
      </Provider>
    ), document.getElementById('feedback-root'));
  }

  initReact(init);
}
