import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { VA_FORM_IDS } from 'platform/forms/constants';

const disabilityForms = new Set([VA_FORM_IDS.FORM_21_526EZ]);

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
                <h2 itemProp="name">How do I file my claim?</h2>
                <div
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="http://schema.org/Answer"
                >
                  <div itemProp="text">
                    <p>You can file online right now.</p>
                    <Wizard
                      pages={pages}
                      expander
                      buttonText="File a disability compensation claim"
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
