import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

const disabilityForms = new Set(['21-526EZ']);

export default function createDisabilityIncreaseApplicationEntry(store) {
  const root = document.getElementById('react-applicationEntry');
  if (root) {
    import(
      /* webpackChunkName: "disability-application-status" */
      '../disabilityIncreaseEntry').then(module => {
      const { ApplicationStatus, DisabilityWizard } = module.default;
      ReactDOM.render((
        <Provider store={store}>
          <ApplicationStatus
            formIds={disabilityForms}
            formType="education"
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
