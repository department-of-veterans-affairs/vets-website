import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './stylesheet.scss';

export default (store, widgetType, baseHeader = 3, showIntroCopy) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "representative-status" */
    './components/App').then(module => {
      const App = module.default;

      ReactDOM.render(
        <Provider store={store}>
          <App baseHeader={baseHeader} showIntroCopy={showIntroCopy} />
        </Provider>,
        root,
      );
    });
  }
};
