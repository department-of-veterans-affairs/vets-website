import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import backendServices from '../../../../platform/user/profile/constants/backendServices';
import formConfig from '../config/form';

const { formId } = formConfig;
const { EVSS_CLAIMS } = backendServices;
const disabilityForms = new Set([formId]);

export default function createDisabilityIncreaseApplicationStatus(store) {
  const root = document.getElementById('react-applicationStatus');
  const state = store.getState();
  const { user: { profile: { savedForms, services } } } = state;
  const hasEVSSClaimsService = !!(services.find(service => service === EVSS_CLAIMS));
  const hasSavedForm = !!(savedForms.find(form => form === formId));
  const shouldGateForm = !hasEVSSClaimsService && hasSavedForm;
  if (shouldGateForm) {
    ReactDOM.render((<div itemProp="steps" itemScope itemType="http://schema.org/HowToSection">
      <h3 itemProp="name">Ready to apply?</h3>
      <div itemProp="itemListElement">
        <div className="usa-alert usa-alert-error no-background-image">Sorry, our system is temporarily down while we fix a few things. Please try again later.</div>
      </div>
    </div>), root);
  }
  if (root && !shouldGateForm) {
    import(
      /* webpackChunkName: "disability-application-status" */
      '../disabilityIncreaseEntry').then(module => {
      const { ApplicationStatus, DisabilityWizard } = module.default;
      ReactDOM.render((
        <Provider store={store}>
          <ApplicationStatus
            formIds={disabilityForms}
            formType="disability compensation"
            showApplyButton={root.getAttribute('data-hide-apply-button') === null}
            stayAfterDelete
            applyRender={() => (
              <div itemScope itemType="http://schema.org/Question">
                <h3 itemProp="name">Ready to apply?</h3>
                <div itemProp="acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                  <div itemProp="text">
                    <DisabilityWizard/>
                  </div>
                </div>
              </div>
            )}/>
        </Provider>
      ), root);
    });
  }
}
