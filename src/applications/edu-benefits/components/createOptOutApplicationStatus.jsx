import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';


export default function createOptOutApplicationStatus(store) {
  const root = document.getElementById('react-applicationStatus');
  if (root) {
    import(/* webpackChunkName: "opt-out-application-status" */ '../utils/optOutStatus.js').then(module => {
      const { ApplicationStatus, OptOutWizard } = module.default;
      ReactDOM.render((
        <Provider store={store}>
          <ApplicationStatus
            formType="education"
            showApplyButton={root.getAttribute('data-hide-apply-button') === null}
            stayAfterDelete
            applyRender={() => (
              <div>
                <OptOutWizard/>
              </div>
            )}/>
        </Provider>
      ), root);
    });
  }
}
