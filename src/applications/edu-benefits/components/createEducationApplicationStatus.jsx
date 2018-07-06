import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

const eduForms = new Set(['22-1990', '22-1995', '22-5490', '22-5495', '22-1990E', '22-1990N']);

export default function createEducationApplicationStatus(store) {
  const root = document.getElementById('react-applicationStatus');
  if (root) {
    import(
      /* webpackChunkName: "education-application-status" */
      '../utils/educationStatus').then(module => {
      const { ApplicationStatus, EducationWizard } = module.default;
      ReactDOM.render((
        <Provider store={store}>
          <ApplicationStatus
            formIds={eduForms}
            formType="education"
            showApplyButton={root.getAttribute('data-hide-apply-button') === null}
            stayAfterDelete
            applyRender={() => (
              <div>
                <h3>How do I apply?</h3>
                <p>You can apply online right now. Just answer a few questions, and we'll help you get started with the education benefits form that's right for you.</p>
                <EducationWizard/>
              </div>
            )}/>
        </Provider>
      ), root);
    });
  }
}
