import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';

const eduForms = new Set([VA_FORM_IDS.FORM_22_0993]);

export default function createOptOutApplicationStatus(store, widgetType) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "opt-out-application-status" */ '../utils/optOutStatus.js').then(
      module => {
        const { ApplicationStatus, OptOutWizard } = module.default;
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
                  <OptOutWizard />
                </div>
              )}
            />
          </Provider>,
          root,
        );
      },
    );
  }
}
