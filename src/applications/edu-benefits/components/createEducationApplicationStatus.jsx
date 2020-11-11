import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';

const formConfigMap = new Map([
  [VA_FORM_IDS.FORM_22_0994, import('../0994/config/form')],
  [VA_FORM_IDS.FORM_22_1990, import('../1990/config/form')],
  [VA_FORM_IDS.FORM_22_1995, import('../1995/config/form')],
  [VA_FORM_IDS.FORM_22_5490, import('../5490/config/form')],
  [VA_FORM_IDS.FORM_22_5495, import('../5495/config/form')],
  [VA_FORM_IDS.FORM_22_1990E, import('../1990e/config/form')],
  [VA_FORM_IDS.FORM_22_1990N, import('../1990n/config/form')],
]);

const eduForms = new Set(formConfigMap.keys());

export default function createEducationApplicationStatus(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    const selectFormConfig = async formId => {
      const config = await formConfigMap.get(formId);
      return config.default;
    };
    import(/* webpackChunkName: "education-application-status" */
    '../utils/educationStatus').then(module => {
      const { ApplicationStatus, EducationWizard } = module.default;

      ReactDOM.render(
        <Provider store={store}>
          <ApplicationStatus
            formIds={eduForms}
            selectFormConfig={selectFormConfig}
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
