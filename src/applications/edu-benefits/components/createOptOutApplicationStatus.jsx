import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

const optOutForm = new Set(['opt-out']);

export default function createOptOutApplicationStatus(store) {
  const root = document.getElementById('react-applicationStatus');
  if (root) {
    import(
      /* webpackChunkName: "education-application-status" */
      '../utils/optOutStatus').then(module => {
      const { ApplicationStatus, OptOutWizard } = module.default;
      ReactDOM.render((
        <Provider store={store}>
          <ApplicationStatus
            formIds={eduForms}
            formType="education"
            showApplyButton={root.getAttribute('data-hide-apply-button') === null}
            stayAfterDelete
            applyRender={() => (
              <div>
                <h3>somethhing something </h3>
                <OptOutWizard />
              </div>
            )}/>
        </Provider>
      ), root);
    });
  }
}
