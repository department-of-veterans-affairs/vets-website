import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator message="Loading..." />;
  }

  return (
    <>
      {formEnabled && (
        <span className="vads-u-display--block">
          <va-link-action
            href="https://www.va.gov/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/"
            text="Apply for DIC, Survivors Pension, or accrued benefits online"
            type="secondary"
          />
        </span>
      )}
      <span className="vads-u-display--block">
        <va-link
          href="https://www.va.gov/find-forms/about-form-21p-534ez"
          text="Get VA Form 21P-534EZ to download"
        />
      </span>
      <p>
        <span className="vads-u-font-weight--bold">
          If you’re a surviving parent
        </span>
        , fill out an Application for Dependency and Indemnity Compensation by
        Parent(s) (VA Form 21P-535).
      </p>
      <va-link
        href="https://vfs.va.gov/find-forms/about-form-21p-535"
        text="Get VA Form 21P-535 to download"
      />
      <h3>You can apply for this benefit in any of these ways:</h3>
      <ul>
        <li>
          <p className="vads-u-margin-bottom--0">
            Work with an accredited attorney, claims agent, or Veterans Service
            Organization (VSO) representative
          </p>
          <span className="vads-u-display--block">
            <va-link
              href="https://www.va.gov/get-help-from-accredited-representative"
              text="Get help filing a claim"
            />
          </span>
        </li>
        <li>
          <p className="vads-u-margin-bottom--0">
            Use the QuickSubmit tool through AccessVA to upload your form online
          </p>
          <span className="vads-u-display--block">
            <va-link
              href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
              text="Go to AccessVA to use QuickSubmit"
            />
          </span>
        </li>
        <li>
          <p className="vads-u-margin-bottom--0">
            Mail your form to this address:
          </p>
          <p className="va-address-block">
            Department of Veterans Affairs <br />
            Pension Intake Center
            <br />
            PO Box 5365
            <br />
            Janesville, WI 53547-5365
            <br />
          </p>
        </li>
        <li>
          <p className="vads-u-margin-bottom--0">
            Go to a VA regional office and get help from a VA employee
          </p>
          <span className="vads-u-display--block">
            <va-link
              href="https://www.va.gov/find-locations/?facilityType=benefits"
              text="Find a VA regional office near you"
            />
          </span>
        </li>
      </ul>
      <p>
        <span className="vads-u-font-weight--bold">Note:</span> After you apply,
        we may select you to participate in a short survey about your experience
        with the claim process. If we select you, we’ll contact you using your
        email address on file.
      </p>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.survivorsBenefitsFormEnabled
  ],
});

export default connect(mapStateToProps)(App);
