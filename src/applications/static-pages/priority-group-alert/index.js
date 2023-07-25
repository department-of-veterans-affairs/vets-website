import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

const createPriorityGroupAlertWidget = async (store, widgetType) => {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (!root) return;

  const App = await import(/* webpackChunkName: "priority-group-alert" */ './components/App')
    .default;
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    root,
  );
};

export default createPriorityGroupAlertWidget;
