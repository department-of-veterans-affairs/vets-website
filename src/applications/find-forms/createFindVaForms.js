import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reducer from './reducers';

export { reducer as findVaFormsWidgetReducer };

export default (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (!root) {
    return;
  }

  import(/* webpackChunkName: "find-va-forms" */
  './find-va-forms-entry').then(module => {
    const { FindVaForms } = module.default;
    ReactDOM.render(
      <Provider store={store}>
        <FindVaForms />
      </Provider>,
      root,
    );
  });
};
