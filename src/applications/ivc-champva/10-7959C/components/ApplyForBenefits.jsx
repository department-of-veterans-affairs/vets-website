import React from 'react';
import PropTypes from 'prop-types';
import {
  CHAMPVA_FAX_NUMBER,
  CHAMPVA_ELIGIBILITY_ADDRESS,
} from '../../shared/constants';

export default function ApplyForBenefits({ goBack }) {
  return (
    <div>
      <h3>
        You should wait to receive the CHAMPVA benefits enrollment packet in the
        mail before submitting this form
      </h3>
      <p>
        If you have not applied for CHAMPVA benefits, you can apply online, by
        mail, or by fax. Make sure to submit the required supporting documents
        with your application.
      </p>
      <va-link
        href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-"
        text="Find out what supporting documents you need"
      />
      <h3>
        <strong>Option 1: Online</strong>
      </h3>
      <p>You can apply online now.</p>
      <div style={{ marginLeft: '3.125rem' }}>
        <va-link-action
          href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/apply-form-10-10d/introduction"
          text="Apply for CHAMPVA online"
        />
      </div>
      <h3>
        <strong>Option 2: By mail or fax</strong>
      </h3>
      <p>
        You'll need to fill out an application for CHAMPVA Benefits (VA Form
        10-10d).
      </p>
      <va-link
        href="https://www.va.gov/find-forms/about-form-10-10d/"
        text="Get VA Form 10-10d to download"
      />
      <p>Mail your completed form and supporting documents to this address:</p>
      {CHAMPVA_ELIGIBILITY_ADDRESS}
      <br />
      Or fax it to:
      <va-telephone contact={CHAMPVA_FAX_NUMBER} />
      <div className="vads-u-margin-top--1">
        <va-link
          href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/"
          text="Learn about CHAMPVA benefits"
        />
      </div>
      <br />
      <va-button data-testid="btn-back" onClick={goBack} back full-width />
    </div>
  );
}

ApplyForBenefits.propTypes = {
  goBack: PropTypes.func,
};
