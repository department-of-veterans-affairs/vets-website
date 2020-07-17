import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';

const disabilityForms = new Set([
  VA_FORM_IDS.FORM_21_526EZ,
  VA_FORM_IDS.FORM_21_526EZ_BDD,
]);

export default function createDisabilityIncreaseApplicationStatus(
  store,
  widgetType,
) {
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  if (root) {
    import(/* webpackChunkName: "disability-application-status" */
    './wizard-entry').then(module => {
      const { ApplicationStatus, Wizard, pages } = module.default;
      ReactDOM.render(
        <Provider store={store}>
          <ApplicationStatus
            formIds={disabilityForms}
            formType="disability compensation"
            showApplyButton={
              root.getAttribute('data-hide-apply-button') === null
            }
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
                    <Wizard
                      pages={pages}
                      expander
                      buttonText="Let's get started"
                    />
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
}
