import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import formConfig from '../config/form';

const childContent = (
  <div>
    <va-alert close-btn-aria-label="Close notification" status="into" visible>
      <h2 slot="headline">Complete all submission steps</h2>
      <p className="vads-u-margin-y--0">
        This form requires additional steps for successful submission. Follow
        the instructions below carefully to ensure your form is submitted
        correctly.
      </p>
    </va-alert>
    <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
      To submit your form, follow the steps below
    </h2>
    <va-process-list uswds>
      <va-process-list-item header="Download and save your form">
        <div itemProp="itemListElement">
          <p>
            Make sure that your completed form is saved as a PDF on your device.
          </p>
          <p>
            <va-link
              href="https://iam.education.va.gov/"
              text="Download VA Form 22-10215"
              download
            />
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Upload the form to the VA education portal">
        <div itemProp="itemListElement">
          <p>
            Visit the&nbsp;
            <a href="/education/about-gi-bill-benefits/how-to-use-benefits/">
              VA Education File Upload Portal (opens in a new tab)
            </a>
            , and upload your saved VA Form 22-10215.
          </p>
        </div>
      </va-process-list-item>
      <va-process-list-item header="Submit your form">
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
      />
    </p>
    <p>
      <va-link
        href="/education/apply-for-education-benefits/application/10215/review-and-submit"
        text="Back"
      />
    </p>
    <h2 className="vads-u-font-size--h2 vad-u-margin-top--0">
      What are my next steps?
    </h2>
    <p>
      After you submit your 85/15 Rule enrollment ratios, we will review them
      within 7-10 business days. Once we review your submission, we will email
      you with our determinations, and any next steps.
    </p>
  </div>
);

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;

  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationView
      formConfig={formConfig}
      confirmationNumber={confirmationNumber}
      submitDate={submitDate}
      pdfUrl={submission?.response?.pdfUrl}
    >
      {childContent}
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
