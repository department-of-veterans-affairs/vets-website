import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import Alert from '../components/Alert';
import GetFormHelp from '../components/GetFormHelp';
import ProcessList from '../components/ProcessList';

export const ConfirmationPage = ({ router, route }) => {
  const isAccredited = localStorage.getItem('isAccredited') === 'true';
  const form = useSelector(state => state.form || {});

  React.useEffect(
    () => {
      if (form.submission?.response?.id) {
        localStorage.setItem(
          '10216claimID',
          JSON.stringify(form.submission?.response?.id),
        );
      }
    },
    [form],
  );

  const calimantID = JSON.parse(localStorage.getItem('10216claimID'));
  const { submission } = form;
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber;
  const goBack = e => {
    e.preventDefault();
    router.push('/review-and-submit');
  };
  const childContent = (
    <div>
      <Alert router={router} />

      <h2
        className="vads-u-font-size--h3 vads-u-margin-bottom--2"
        data-testid="confirmation-header"
      >
        To submit your {!isAccredited ? 'forms' : 'form'}, follow the steps
        below
      </h2>
      <ProcessList isAccredited={isAccredited} id={calimantID} />
      <p>
        <va-button
          secondary
          text="Print this page"
          data-testid="print-page"
          onClick={() => window.print()}
        />
      </p>
      <va-link
        onClick={goBack}
        class="screen-only vads-u-margin-top--1 vads-u-font-weight--bold"
        data-testid="back-button"
        text="Back"
        href="#"
      />
      <h2 className="vads-u-font-size--h2 vads-u-margin-top--4">
        What are my next steps?
      </h2>
      <p>
        After submitting your exemption request, we will review your submission
        within 7-10 business days. Once we complete the review, we will email
        your school a letter with the decision. If we accept your request, we
        will include a copy of WEAMS form 1998 as confirmation in the letter. If
        we deny your request, we will explain the reason for rejection in the
        letter and provide further instructions for resubmission or additional
        steps.
      </p>
      <va-link-action
        href="/education/apply-for-education-benefits/application/10215"
        text="Go to VA Form 22-10215 now"
        class="vads-u-margin-top--1p5 vads-u-margin-bottom--2"
      />
    </div>
  );

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      confirmationNumber={confirmationNumber}
      submitDate={submitDate}
      pdfUrl={submission?.response?.pdfUrl}
    >
      {childContent}
      <ConfirmationView.NeedHelp content={<GetFormHelp />} />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  isAccredited: PropTypes.bool,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default ConfirmationPage;
