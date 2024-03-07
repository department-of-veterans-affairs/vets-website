import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';
import startReactApp from '@department-of-veterans-affairs/platform-startup/react';
import setUpCommonFunctionality from './setup';

export default function startApp({ entryName, reducer, routes, url }) {
  const store = setUpCommonFunctionality({
    entryName,
    reducer,
  });

  startReactApp(
    <Provider store={store}>
      <BrowserRouter basename={url}>
        <CompatRouter>{routes}</CompatRouter>
      </BrowserRouter>
    </Provider>,
  );
}
