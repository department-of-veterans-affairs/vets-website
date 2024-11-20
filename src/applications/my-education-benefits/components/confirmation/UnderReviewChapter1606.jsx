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

      <div className="feature">
        <h3>Application for VA education benefits (VA Form 22-1990)</h3>
        <h3>MGIB-SR, Chapter 1606</h3>
        {claimantName.trim() ? <p>For {claimantName}</p> : <></>}
        <dl>
          <dt>Date received</dt>
          <dd>{confirmationDate}</dd>
        </dl>
        <va-button
          uswds
          className="usa-button meb-print"
          text="Print this page"
          onClick={printPage}
        />
      </div>

      <h2>When will I hear back about my application?</h2>
      <div className="feature meb-feature--secondary">
        <h2>In 1 month</h2>
        <hr className="meb-hr" />
        <p>
          If more than a month has passed since you gave us your application and
          you haven’t heard back, please don’t apply again. Call our toll-free
          Education Call Center at <va-telephone contact="8884424551" /> or{' '}
          <va-telephone contact="9187815678" international /> if you are outside
          the U.S.
        </p>
      </div>

      <h2>What happens next?</h2>
      <ul>
        <li>
          We’ll review your eligibility for the Montgomery GI Bill Selective
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
          please send this through <a href="/contact-us">Ask VA</a>.
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
