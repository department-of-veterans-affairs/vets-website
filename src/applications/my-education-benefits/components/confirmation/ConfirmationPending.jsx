import React from 'react';
import PropTypes from 'prop-types';
import FormFooter from '../FormFooter';

export default function ConfirmationPending({
  claimantName,
  confirmationDate,
  printPage,
}) {
  return (
    <div className="meb-confirmation-page meb-confirmation-page_denied">
      <va-alert status="success">
        <h3 slot="headline">We’ve received your application</h3>
        <p>
          Your application requires additional review. Once we have reviewed
          your application, we will reach out to notify you about next steps.
        </p>
      </va-alert>

      <div className="feature">
        <h3>Application for VA education benefits (Form 22-1990)</h3>
        {claimantName.trim() ? <p>For {claimantName}</p> : <></>}
        <dl>
          <dt>Date received</dt>
          <dd>{confirmationDate}</dd>
        </dl>
        <button
          className="usa-button meb-print"
          onClick={printPage}
          type="button"
        >
          Print this page
        </button>
      </div>

      <h2>When will I hear back about my application?</h2>
      <div className="feature meb-feature--secondary">
        <h2>In 1 month</h2>
        <hr className="meb-hr" />
        <p>
          If more than a month has passed since you gave us your application and
          you haven’t heard back, please don’t apply again. Call our toll-free
          Education Call Center at{' '}
          <a href="tel:1-888-442-4551">1-888-442-4551</a> or{' '}
          <a href="tel:001-918-781-5678">001-918-781-5678</a> if you are outside
          the U.S.
        </p>
      </div>

      <h2>What happens next?</h2>
      <ul>
        <li>We will review your eligibility for the Post-9/11 GI Bill.</li>
        <li>We may reach out with questions about your application.</li>
        <li>
          You will be notified if you are eligible for VA education benefits.
        </li>
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
          <a href="/education/gi-bill-comparison-tool/ ">
            GI Bill Comparison Tool
          </a>{' '}
          to help you decide which education program and school is best for you.
        </li>
        <li>
          Learn more about VA benefits and programs through the{' '}
          <a href="https://blogs.va.gov/VAntage/78073/new-guide-series-provides-gi-bill-benefits-information/">
            Building Your Future with the GI Bill Series
          </a>
          .
        </li>
        <li>
          Measure your interests and skill levels and help figure out your
          career path with{' '}
          <a href="https://www.benefits.va.gov/gibill/careerscope.asp">
            CareerScope®
          </a>
          .
        </li>
      </ul>

      <a className="vads-c-action-link--green" href="/my-va/">
        Go to your My VA dashboard
      </a>

      <FormFooter />
    </div>
  );
}

ConfirmationPending.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  printPage: PropTypes.func.isRequired,
};
