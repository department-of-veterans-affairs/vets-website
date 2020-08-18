// Dependencies.
import React from 'react';
import ReactDOM from 'react-dom';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { fetchFormsApi } from '../api';

const InvalidPdfMessage = () => (
  <AlertBox
    status="error"
    headline="This form link isn’t working"
    content={
      <>
        We’re sorry, but the form you’re trying to download appears to have an
        invalid link. Please{' '}
        <a href="mailto:VaFormsManagers@va.gov">email the forms managers</a> for
        help with this form.
      </>
    }
  />
);

export default (store, widgetType) => {
  // Derive the element to render our widget.
  const root = document.querySelector(`[data-widget-type="${widgetType}"]`);
  const formName = root.dataset.formName;

  // Escape early if no element was found.
  if (!root) {
    return;
  }

  const pdfLink = document.querySelector(root.dataset.pdfLink);

  pdfLink.addEventListener('click', async event => {
    event.preventDefault();

    const forms = await fetchFormsApi(formName);
    const form = forms.find(f => f.attributes.formName === formName);

    if (!form?.attributes.validPdf) {
      pdfLink.remove();
      ReactDOM.render(<InvalidPdfMessage />, root);
    } else {
      window.open(pdfLink.href);
    }
  });
};
