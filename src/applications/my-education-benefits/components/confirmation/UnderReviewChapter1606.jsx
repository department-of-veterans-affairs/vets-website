import React from 'react';
import PropTypes from 'prop-types';
import FormFooter from '../FormFooter';

const UnderReviewChapter1606 = ({
  claimantName,
  confirmationDate,
  printPage,
}) => {
  return (
    <div className="meb-confirmation-page meb-confirmation-page_pending">
      <va-alert status="success">
        <h3 slot="headline">We’ve received your application</h3>
        <p>
          Your application requires additional review. Once we have reviewed
          your application, we will reach out to notify you about next steps.
        </p>
      </va-alert>

      <va-summary-box class="vads-u-margin-y--3">
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Application for VA education benefits (VA Form 22-1990)
        </h3>
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          MGIB-SR, Chapter 1606
        </h3>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Who submitted this form
          </h4>
          {claimantName.trim() ? (
            <p className="vads-u-margin--0">{claimantName}</p>
          ) : (
            <p className="vads-u-margin--0">Not provided</p>
          )}
        </div>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Date received
          </h4>
          <p className="vads-u-margin--0">{confirmationDate}</p>
        </div>

        <div className="vads-u-margin-bottom--3">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Confirmation for your records
          </h4>
          <p className="vads-u-margin--0">
            You can print this confirmation page for your records.
          </p>
        </div>

        <div className="vads-u-margin-bottom--2">
          <va-button
            class="meb-print"
            text="Print this page"
            onClick={printPage}
          />
        </div>
      </va-summary-box>

      <h2>When will I hear back about my application?</h2>
      <va-card background class="vads-u-margin-y--3">
        <h2>In 1 month</h2>
        <hr className="meb-hr" />
        <p>
          If more than a month has passed since you gave us your application and
          you haven’t heard back, please don’t apply again. Call our Education
          Call Center toll-freeCenter at <va-telephone contact="8884424551" />{' '}
          or <va-telephone contact="9187815678" international /> if you are
          outside the U.S.
        </p>
      </va-card>

      <h2>What happens next?</h2>
      <ul>
        <li>
          We’ll review your eligibility for the Montgomery GI Bill Selected
          Reserve (MGIB-SR).
        </li>
        <li>We may reach out with questions about your application.</li>
        <li>We’ll notify you if you’re eligible for VA education benefits.</li>
        <li>There is no further action required by you at this time.</li>
      </ul>

      <h2>What can I do while I wait?</h2>
      <ul>
        <li>
          If you need to submit documentation to VA, such as service records,
          please send this through <a href="https://ask.va.gov/">Ask VA</a>.
        </li>
        <li>
          Review and/or update your direct deposit information on{' '}
          <a href="/change-direct-deposit/">your VA.gov profile</a>.
        </li>
        <li>
          Use our{' '}
          <a href="/education/gi-bill-comparison-tool/">
            GI Bill Comparison Tool
          </a>{' '}
          to help you decide which school is best for you.
        </li>
        <li>
          Learn more about VA benefits and programs through the{' '}
          <a href="https://blogs.va.gov/VAntage/78073/new-guide-series-provides-gi-bill-benefits-information/">
            Building Your Future with the GI Bill Series
          </a>
          .
        </li>
      </ul>

      <FormFooter />
    </div>
  );
};

UnderReviewChapter1606.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  printPage: PropTypes.func.isRequired,
};

export default UnderReviewChapter1606;
