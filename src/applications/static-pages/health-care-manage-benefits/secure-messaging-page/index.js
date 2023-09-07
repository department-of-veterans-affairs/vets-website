// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { connectDrupalSourceOfTruthCerner } from 'platform/utilities/cerner/dsot';

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    connectDrupalSourceOfTruthCerner(store.dispatch);
    import(/* webpackChunkName: "secure-messaging-page" */
    './components/App').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App widgetType={widgetType} />
        </Provider>,
        root,
      );
    });
  }
};
