import React from 'react';
import PropTypes from 'prop-types';
import { LETTER_URL } from '../../constants';
import FormFooter from '../FormFooter';

export default function ConfirmationApproved({
  claimantName,
  confirmationDate,
  printPage,
}) {
  return (
    <div className="meb-confirmation-page meb-confirmation-page_approved">
      <va-alert status="success">
        <h3 slot="headline">
          Congratulations! You have been approved for the Post-9/11 GI Bill
        </h3>
        <p>
          We reviewed your application and have determined that you are entitled
          to educational benefits under the Post-9/11 GI Bill. Your Certificate
          of Eligibility is now available. A physical copy will also be mailed
          to your mailing address.
        </p>
        <va-link
          download
          href={LETTER_URL}
          text="Download your Certificate of Eligibility"
          class="vads-u-padding-bottom--2"
        />
        <br />
        <br />
        <a href="https://www.va.gov/education/gi-bill/post-9-11/ch-33-benefit/ ">
          View a statement of your benefits
        </a>
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

      <h2>What happens next?</h2>
      <ul>
        <li>
          Download a copy of your{' '}
          <a href={LETTER_URL} download>
            Certificate of Eligibility
          </a>
        </li>
        <li>
          Use our{' '}
          <a href="/education/gi-bill-comparison-tool/ ">
            GI Bill Comparison Tool
          </a>{' '}
          to help you decide which education program and school is best for you.
        </li>
        <li>
          Once you’ve selected a school or program, you may bring your
          Certificate of Eligibility to your School Certifying Official to
          provide proof of eligibility.
        </li>
        <li>
          Review and/or update your direct deposit information on your{' '}
          <a href="/change-direct-deposit/">VA.gov profile</a>.
        </li>
        <li>
          Learn more about VA benefits and programs through the{' '}
          <a
            href="https://blogs.va.gov/VAntage/78073/new-guide-series-provides-gi-bill-benefits-information/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Building Your Future with the GI Bill Series
          </a>
          .
        </li>
      </ul>

      <va-additional-info trigger="What is a Certificate of Eligibility?">
        <p>
          A Certificate of Eligibility is an official document from the U.S.
          Department of Veterans Affairs that details your GI Bill benefit
          status. You may provide this official document to your educational
          institution to prove your eligibility status.
        </p>
        <a
          href="https://benefits.va.gov/gibill/understandingyourcoe.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Understanding your Certificate of Eligibility
        </a>
      </va-additional-info>

      <a className="vads-c-action-link--green" href="/my-va/">
        Go to your My VA dashboard
      </a>

      <FormFooter />
    </div>
  );
}

ConfirmationApproved.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  printPage: PropTypes.func.isRequired,
};
