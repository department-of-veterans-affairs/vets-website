import React from 'react';
import { Provider } from 'react-redux';
import Main from './containers/Main';
import startReactApp from '../../platform/startup/react';

export default function createFeedbackWidget(store) {
  const feedbackRoot = document.getElementById('feedback-root');
  if (!feedbackRoot) return;

  startReactApp((
    <Provider store={store}>
      <Main/>
    </Provider>
  ), feedbackRoot);
}
