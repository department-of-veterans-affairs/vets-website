import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';

const eduForms = new Set([
  VA_FORM_IDS.FORM_22_0994,
  VA_FORM_IDS.FORM_22_1990,
  VA_FORM_IDS.FORM_22_1995,
]);

export default function createEducationApplicationStatus(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "education-application-status" */
    '../utils/educationStatus').then(module => {
      const { ApplicationStatus, EducationWizard } = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <ApplicationStatus
            formIds={eduForms}
            formType="education"
            showApplyButton={
              root.getAttribute('data-hide-apply-button') === null
            }
            stayAfterDelete
            applyRender={() => (
              <div>
                <h2>How do I apply?</h2>
                <p>
                  You can apply online right now. Just answer a few questions,
                  and we'll help you get started with the education benefits
                  form that's right for you.
                </p>
                <EducationWizard />
              </div>
            )}
          />
        </Provider>,
        root,
      );
    });
  }
}
