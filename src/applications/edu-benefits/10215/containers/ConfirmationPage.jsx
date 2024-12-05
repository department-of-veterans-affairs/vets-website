import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

const childContent = (
  <div>
    <h1 data-testid="form-title">
      Request exemption from the 85/15 Rule reporting requirements
    </h1>
    <p>
      35% exemption request from 85/15 Rule reporting requirements (VA Form
      22-10216)
    </p>
    <va-alert close-btn-aria-label="Close notification" status="into" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <p className="vads-u-margin-y--0">
        This form requires additional steps for successful submission. Follow
        the instructions below carefully to ensure your form is submitted
        correctly.
      </p>
    </va-alert>
    <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
      To submit your form, follow the steps below
    </h2>
    <va-process-list uswds>
      <va-process-list-item header="Check your eligibility">
        <div itemProp="name">
          <h4 className="vads-u-font-size--h5">Download and save your form</h4>
        </div>
        <div itemProp="itemListElement">
          <p>
            We usually process claims within 30 days. We’ll let you know by mail
            if we need more information.
          </p>
          <p>
            <va-link
              href="https://iam.education.va.gov/"
              text="Download VA Form 22-10216"
              download
            />
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Check your eligibility">
        <div>
          <h4 className="vads-u-font-size--h5">
            Upload the form to the VA education portal
          </h4>
        </div>
        <div itemProp="itemListElement">
          <p>
            Visit the&nbsp;
            <a href="/education/about-gi-bill-benefits/how-to-use-benefits/">
              VA Education File Upload Portal (opens in a new tab)
            </a>
            , and upload your saved VA Form 22-10216.
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Check your eligibility">
        <div itemProp="name">
          <h4 className="vads-u-font-size--h5">Submit your form</h4>
        </div>
        <div itemProp="itemListElement">
          <p>Once uploaded, click submit to finalize your request.</p>
        </div>
      </va-process-list-item>
    </va-process-list>
    <p>
      <va-button
        secondary
        text="Print this page"
        onClick={() => window.print()}
        data-testid="ezr-print-button"
      />
    </p>
    <p>
      <va-link href="https://iam.education.va.gov/" text="Back" />
    </p>
    <h1>What are my next steps?</h1>
    <p>
      After submitting your exemption request, we will review your submission
      within 7-10 business days. Once we complete the review, we will email your
      school a letter with the decision.If we accept your request, we will
      include a copy of WEAMS form 1998 as confirmation in the letter. If we
      deny your request, we will explain the reason for rejection in the letter
      and provide further instructions for resubmission or additional steps.
    </p>
    <va-link-action
      className="vads-u-display--block hydrated"
      href="/"
      text="Go back to VA.gov"
      type="secondary"
    />
  </div>
);

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const { formConfig } = props?.route;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationView
      formConfig={formConfig}
      confirmationNumber={confirmationNumber}
      submitDate={submitDate}
      pdfUrl={submission.response?.pdfUrl}
    >
      {childContent}
      <ConfirmationView.HowToContact />
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp />
    </ConfirmationView>
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
  route: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
