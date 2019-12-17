// Dependencies.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Relative imports.
import reducer from './reducers';

export { reducer as findVaFormsWidgetReducer };

export default (store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  // webpackChunkName: "find-va-forms"
  import('./find-va-forms-entry').then(module => {
    const { FindVaForms } = module.default;
    ReactDOM.render(
      <Provider store={store}>
        <FindVaForms />
      </Provider>,
      root,
    );
  });
};
