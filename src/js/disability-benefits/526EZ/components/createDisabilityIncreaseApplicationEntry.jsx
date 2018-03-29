import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

const eduForms = new Set(['22-1990', '22-1995', '22-5490', '22-5495', '22-1990E', '22-1990N']);

export default function createDisabilityIncreaseApplicationEntry(store) {
  const root = document.getElementById('react-applicationEntry');
  if (root) {
    import(
      /* webpackChunkName: "education-application-status" */
      '../disabilityIncreaseEntry').then(module => {
      const { ApplicationStatus, DisabilityWizard } = module.default;
      ReactDOM.render((
        <Provider store={store}>
          <ApplicationStatus
            formIds={eduForms}
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
