import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';

const formIds = new Set([VA_FORM_IDS.FORM_20_0996]);

// Used to add HLR wizard to the Drupal content page
export default function createHigherLevelReviewApplicationStatus(
  store,
  widgetType,
) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "higher-level-review-application-status" */
    '../utils').then(module => {
      const { ApplicationStatus, WizardLink } = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <ApplicationStatus
            formIds={formIds}
            formType="higher-level-review"
            showApplyButton={
              root.getAttribute('data-hide-apply-button') === null
            }
            stayAfterDelete
            applyRender={() => <WizardLink />}
          />
        </Provider>,
        root,
      );
    });
  }
}
