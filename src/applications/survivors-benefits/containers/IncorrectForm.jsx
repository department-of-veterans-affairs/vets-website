import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

export const IncorrectForm = ({
  goBack,
  contentAfterButtons,
  contentBeforeButtons,
}) => {
  const progressBar = document.getElementById('nav-form-header');

  useEffect(
    () => {
      const timeout = setTimeout(() => {
        scrollTo('topScrollElement');
        if (progressBar) {
          progressBar.style.display = 'block';
          focusElement(progressBar);
        }
      }, 250);

      return () => clearTimeout(timeout);
    },
    [progressBar],
  );

  return (
    <>
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
        This might not be the right form for you
      </h3>
      <p>To use this form, the claimant should be one of these:</p>

      <ul>
        <li>
          Veteran’s surviving spouse,{' '}
          <span className="vads-u-font-weight--bold">or</span>
        </li>
        <li>
          Custodian filing for a Veteran’s child that’s under 18,{' '}
          <span className="vads-u-font-weight--bold">or</span>
        </li>
        <li>
          Veteran’s adult child who is 18-23 years old and still in school,{' '}
          <span className="vads-u-font-weight--bold">or</span>
        </li>
        <li>Veteran’s adult child who is seriously disabled</li>
      </ul>
      <p>
        <span className="vads-u-font-weight--bold">
          If you’re a surviving parent of a Veteran
        </span>
        , you can fill out an Application for Dependency and Indemnity
        Compensation by Parent(s) (VA Form 21P-535).
      </p>
      <va-link
        href="https://www.va.gov/find-forms/about-form-21p-535/"
        text="Get VA Form 21P-535 to download"
        external
      />
      <p>
        <span className="vads-u-font-weight--bold">
          If you’re the executor or administrator of the beneficiary’s estate
        </span>
        , you can fill out an Application for Accrued Amounts Due a Deceased
        Beneficiary (VA Form 21P-601).
      </p>
      <span className="vads-u-display--block">
        <va-link
          href="https://www.va.gov/family-and-caregiver-benefits/survivor-compensation/apply-for-accrued-benefits-form-21p-601/"
          text="Apply for accrued benefits online"
          external
        />
      </span>
      <span className="vads-u-display--block">
        <va-link
          href="https://www.va.gov/find-forms/about-form-21p-601/"
          text="Get VA Form 21P-601 to download"
          external
        />
      </span>
      <p>
        You can now exit this form, or select{' '}
        <span className="vads-u-font-weight--bold">Back</span> to change your
        answer.
      </p>
      <span className="vads-u-display--block">
        <va-link-action
          href="https://va.gov/"
          text="Exit application"
          type="secondary"
        />
      </span>
      {contentBeforeButtons}
      <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
        <div className="small-6 medium-5 columns">
          <ProgressButton
            onButtonClick={goBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        </div>
      </div>
      {contentAfterButtons}
    </>
  );
};

IncorrectForm.propTypes = {
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  goBack: PropTypes.func,
};
export default IncorrectForm;
