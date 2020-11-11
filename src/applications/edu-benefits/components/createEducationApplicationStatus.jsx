import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';

const eduForms = new Set([
  VA_FORM_IDS.FORM_22_0994,
  VA_FORM_IDS.FORM_22_1990,
  VA_FORM_IDS.FORM_22_1995,
  VA_FORM_IDS.FORM_22_5490,
  VA_FORM_IDS.FORM_22_5495,
  VA_FORM_IDS.FORM_22_1990E,
  VA_FORM_IDS.FORM_22_1990N,
]);

const formConfigMap = new Map([
  [eduForms[0], '../0994/config/form'],
  [eduForms[1], '../1990/config/form'],
  [eduForms[2], '../1995/config/form'],
  [eduForms[3], '../5490/config/form'],
  [eduForms[4], '../5495/config/form'],
  [eduForms[5], '../1990e/config/form'],
  [eduForms[6], '../1990n/config/form'],
]);

export default function createEducationApplicationStatus(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    const state = store.getState();
    const savedForms = state.user.profile.savedForms;
    const matchingForms = savedForms.filter(({ form }) => eduForms.has(form));
    const inProgressFormId = matchingForms.length
      ? matchingForms.sort(({ metadata }) => -1 * metadata.lastUpdated)[0].form
      : null;

    const configPath = formConfigMap[inProgressFormId];
    Promise.all([
      import(/* webpackChunkName: "education-application-status" */
      '../utils/educationStatus'),
      (!!configPath && import(configPath)) || null,
    ]).then(([appStatusModule, formConfigModule]) => {
      const { ApplicationStatus, EducationWizard } = appStatusModule.default;
      const formConfig = formConfigModule?.default || {};
      ReactDOM.render(
        <Provider store={store}>
          <ApplicationStatus
            formIds={eduForms}
            formConfig={formConfig}
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
