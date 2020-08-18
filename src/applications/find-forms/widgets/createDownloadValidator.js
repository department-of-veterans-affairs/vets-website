// Dependencies.
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { fetchFormsApi } from '../api';

class InvalidPdfMessage extends React.Component {
  state = {
    isVisible: false,
  };

  componentDidMount() {
    const { formName, downloadLinkSelector } = this.props;
    const pdfLink = document.querySelector(downloadLinkSelector);
    const pdfFileUrl = pdfLink.href;

    pdfLink.addEventListener('click', async event => {
      event.preventDefault();

      // Default to true in case we encounter an error
      // determining validity through the API.
      let formPdfIsValid = true;
      let form = null;

      try {
        const forms = await fetchFormsApi(formName);
        form = forms.find(f => f.attributes.formName === formName);
        formPdfIsValid = form?.attributes.validPdf;
      } catch (err) {
        // Todo
      }

      if (formPdfIsValid) {
        window.open(pdfFileUrl);
      } else {
        Sentry.withScope(scope => {
          scope.setExtra('form API response', form);
          scope.setExtra('form number (aka form name)', formName);
          scope.setExtra('pdf link', pdfFileUrl);
          Sentry.captureMessage(
            `Find Forms - Form Detail - invalid PDF accessed`,
          );
        });

        pdfLink.remove();
        this.setState({ isVisible: true });
      }
    });
  }

  render() {
    return (
      <AlertBox
        isVisible={this.state.isVisible}
        status="error"
        headline="This form link isn’t working"
        content={
          <>
            We’re sorry, but the form you’re trying to download appears to have
            an invalid link. Please{' '}
            <a href="mailto:VaFormsManagers@va.gov">email the forms managers</a>{' '}
            for help with this form.
          </>
        }
      />
    );
  }
}

export default (store, widgetType) => {
  const roots = document.querySelectorAll(`[data-widget-type="${widgetType}"]`);

  for (const root of [...roots]) {
    ReactDOM.render(
      <InvalidPdfMessage
        formName={root.dataset.formName}
        downloadLinkSelector={root.dataset.pdfLink}
      />,
      root,
    );
  }
};
