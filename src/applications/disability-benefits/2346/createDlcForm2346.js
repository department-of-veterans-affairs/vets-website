// Dependencies.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// Relative imports.
import reducer from './reducers';

export { reducer as form2346WidgetReducer };

export default (store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  // webpackChunkName: "find-va-forms"
  import('./disability-2346-form-entry').then(module => {
    const { App } = module.default;
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      root,
    );
  });
};
