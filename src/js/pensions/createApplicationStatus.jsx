import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

export default function createPensionApplicationStatus(store) {
  const root = document.getElementById('react-pensionApplicationStatus');

  if (root) {
    import(
      /* webpackChunkName: "pension-application-status" */
      '../common/schemaform/ApplicationStatus').then(module => {
      const ApplicationStatus = module.default;
      ReactDOM.render((
        <Provider store={store}>
          <ApplicationStatus
            formId="21P-527EZ"
            showApplyButton={root.getAttribute('data-hide-apply-button') === null}
            applyText="Apply for a Veterans Pension"/>
        </Provider>
      ), root);
    });
  }
}
