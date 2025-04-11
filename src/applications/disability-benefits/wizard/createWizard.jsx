import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

import WizardLink from './WizardLink';
import { WIZARD_STATUS } from '../all-claims/constants';

const disabilityForms = new Set([VA_FORM_IDS.FORM_21_526EZ]);

// This file & the `WizardLink` files won't be neccessary once we get the
// flipper to 100% and the Drupal page includes a direct link to the
// introduction page
export default function createDisabilityIncreaseApplicationStatus(
  store,
  widgetType,
) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);

  if (!root) {
    return;
  }

  import(
    /* webpackChunkName: "disability-application-status" */
    './wizard-entry'
  ).then(module => {
    const { ApplicationStatus } = module.default;
    connectFeatureToggle(store.dispatch);

    ReactDOM.render(
      <Provider store={store}>
        <ApplicationStatus
          formIds={disabilityForms}
          formType="disability compensation"
          wizardStatus={WIZARD_STATUS}
          showApplyButton={root.getAttribute('data-hide-apply-button') === null}
          stayAfterDelete
          applyRender={() => (
            <div itemScope itemType="http://schema.org/Question">
              <h2 itemProp="name">Can I file my claim online?</h2>
              <div
                itemProp="acceptedAnswer"
                itemScope
                itemType="http://schema.org/Answer"
              >
                <div itemProp="text">
                  <p>
                    It depends on your situation. Answer a few questions, and
                    we&apos;ll guide you to the right place.
                  </p>
                  <WizardLink module={module} />
                </div>
              </div>
            </div>
          )}
        />
      </Provider>,
      root,
    );
  });
}
