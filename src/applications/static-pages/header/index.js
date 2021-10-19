// Node modules.
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default (store, widgetType) => {
  // Derive the widget and its data properties for props.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  const props = root.dataset;

  // Render the widget.
  if (root) {
    import(/* webpackChunkName: "header" */
    './components/App').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App
            show={props.show === 'true'}
            showMegaMenu={props.showMegaMenu === 'true'}
            showNavLogin={props.showNavLogin === 'true'}
          />
        </Provider>,
        root,
      );
    });
  }
};
