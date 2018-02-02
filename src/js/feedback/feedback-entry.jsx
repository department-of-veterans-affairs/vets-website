import '../common';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Main from './containers/Main';
import initReact from '../common/init-react';

export default function createFeedbackWidget(store) {
  const feedbackRoot = document.getElementById('feedback-root');
  if (!feedbackRoot) return;

  function init() {
    ReactDOM.render((
      <Provider store={store}>
        <Main/>
      </Provider>
    ), feedbackRoot);
  }

  initReact(init);
}
