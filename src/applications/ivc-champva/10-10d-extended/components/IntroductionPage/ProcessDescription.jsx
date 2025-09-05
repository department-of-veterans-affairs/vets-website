import React from 'react';
import PropTypes from 'prop-types';

const ProcessDescription = ({ resBurden }) => (
  <>
    <h2>Follow these steps to get started</h2>
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>Make sure you meet our eligibility requirements before you apply.</p>
        <va-link
          text="Find out if you’re eligible for CHAMPVA benefits"
          href="/family-and-caregiver-benefits/health-and-disability/champva/"
        />
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>
          <strong>
            You’ll need to provide personal information for these people:
          </strong>
        </p>
        <ul>
          <li>Yourself, and</li>
          <li>Anyone you’re applying for, and</li>
          <li>
            Your sponsor (the Veteran or service member you’re connected to)
          </li>
        </ul>
        <p>
          Personal information may include dates of birth, Social Security
          numbers, and contact information.
        </p>
        <p>
          You’ll also need to submit these supporting documents if appropriate:
        </p>
        <ul>
          <li>Health insurance cards</li>
          <li>Medicare cards</li>
          <li>Proof of school enrollment</li>
          <li>Proof of marriage or legal union</li>
          <li>Proof of adoption</li>
          <li>Birth certificate of dependent(s)</li>
        </ul>
        <p>
          You may also need to submit supporting documents, like copies of your
          health insurance cards or proof of school enrollment.
        </p>
        <va-link
          text="Find out which documents you’ll need to apply for CHAMPVA"
          href="/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-"
        />
      </va-process-list-item>
      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. It should take about{' '}
          {resBurden} minutes.
        </p>
      </va-process-list-item>
      <va-process-list-item header="After you apply">
        <p>We’ll contact you if we have questions or need more information.</p>
      </va-process-list-item>
    </va-process-list>
  </>
);

ProcessDescription.propTypes = {
  resBurden: PropTypes.number,
};

export default ProcessDescription;
