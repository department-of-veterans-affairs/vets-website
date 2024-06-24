import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Toggler } from '~/platform/utilities/feature-toggles';

export default function createFormUploadAccess(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  const { hasOnlineTool, formNumber } = root.dataset;

  if (root) {
    import(/* webpackChunkName: "form-upload" */ './App').then(module => {
      const App = module.default;
      ReactDOM.render(
        <Toggler toggleName={Toggler.TOGGLE_NAMES.formUploadFlow}>
          <Toggler.Enabled>
            <Provider store={store}>
              <App
                hasOnlineTool={hasOnlineTool === 'true'}
                formNumber={formNumber}
              />
            </Provider>
          </Toggler.Enabled>

          <Toggler.Disabled>{null}</Toggler.Disabled>
        </Toggler>,
        root,
      );
    });
  }
}
