import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

const createPriorityGroupAlertWidget = (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (!root) return;

  import(/* webpackChunkName: "priority-group-alert" */ './components/App').then(
    module => {
      const App = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <App />
        </Provider>,
        root,
      );
    },
  );
};

export default createPriorityGroupAlertWidget;
