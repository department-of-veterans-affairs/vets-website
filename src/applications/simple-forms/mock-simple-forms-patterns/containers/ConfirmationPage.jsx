import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';

import environment from 'platform/utilities/environment';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

let mockData;
if (!environment.isProduction() && !environment.isStaging()) {
  mockData = require('../tests/e2e/fixtures/data/default.json');
  mockData = mockData?.data;
}

const USE_CONFIRMATION_PAGE_V2 = true;

const ConfirmationPage = ({ route }) => {
  const form = useSelector(state => state.form || {});
  const { submission, data } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;
  const pdfUrl = submission.response?.pdfUrl;
  const { fullName } = data;

  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  if (USE_CONFIRMATION_PAGE_V2) {
    return (
      <ConfirmationView
        submitDate={submitDate}
        confirmationNumber={confirmationNumber}
        formConfig={route.formConfig}
        pdfUrl={pdfUrl}
        devOnly={{
          showButtons: true,
          mockData,
        }}
      />
    );
  }

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <h2 slot="headline">Thank you for completing your application</h2>
        <p className="vads-u-margin-y--0">
          After we review your application, we&rsquo;ll contact you to tell you
          what happens next in the application process.
        </p>
      </va-alert>
      <div className="inset">
        <h3 className="vads-u-margin-top--0">Your application information</h3>
        {fullName ? (
          <>
            <h4>Applicant</h4>
            <p>
              {fullName.first} {fullName.middle} {fullName.last}
              {fullName.suffix ? `, ${fullName.suffix}` : null}
            </p>
          </>
        ) : null}

        {confirmationNumber ? (
          <>
            <h4>Confirmation number</h4>
            <p>{confirmationNumber}</p>
          </>
        ) : null}

        {isValid(submitDate) ? (
          <>
            <h4>Date submitted</h4>
            <p>{format(submitDate, 'MMMM d, yyyy')}</p>
          </>
        ) : null}

        <h4>Confirmation for your records</h4>
        <p>You can print this confirmation page for your records</p>
        <va-button
          className="usa-button vads-u-margin-top--0 screen-only"
          onClick={window.print}
          text="Print this page"
        />
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

export default ConfirmationPage;

ConfirmationPage.propTypes = {
  route: PropTypes.object,
};
