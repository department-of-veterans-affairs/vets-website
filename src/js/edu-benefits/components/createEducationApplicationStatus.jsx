import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import EducationWizard from '../components/EducationWizard';

const eduForms = new Set(['22-1990', '22-1995', '22-5490', '22-5495', '22-1990E', '22-1990N']);

export default function createEducationApplicationStatus(store) {
  const root = document.getElementById('react-applicationStatus');
  if (root) {
    import(
      /* webpackChunkName: "education-application-status" */
      '../../common/schemaform/ApplicationStatus').then(module => {
      const ApplicationStatus = module.default;
      ReactDOM.render((
        <Provider store={store}>
          <ApplicationStatus
            formIds={eduForms}
            formType="education"
            showApplyButton={root.getAttribute('data-hide-apply-button') === null}
            stayAfterDelete
            applyRender={() => <EducationWizard/>}/>
        </Provider>
      ), root);
    });
  }
}
