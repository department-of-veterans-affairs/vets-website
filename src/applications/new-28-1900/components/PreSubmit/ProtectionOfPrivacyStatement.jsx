import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ProtectionOfPrivacyStatement = props => {
  const {
    hasSubmittedForm,
    isChecked,
    onSectionComplete,
    setIsChecked,
    showError,
  } = props;

  const [error, setError] = useState(null);

  useEffect(
    () => {
      const hasError =
        isChecked === true || hasSubmittedForm ? false : showError;
      if (hasError) {
        onSectionComplete(false);
      }
      const message = hasError ? 'Must certify by checking box' : null;
      setError(message);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showError, isChecked, hasSubmittedForm],
  );

  const handleCheck = event => {
    const value = event.target.checked;
    setIsChecked(value);
  };

  return (
    <fieldset className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--1">
      <legend className="signature-box--legend vads-u-display--block vads-u-width--full vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--bold">
        Protection of privacy information statement
      </legend>
      <p>
        <strong className="privacy-statement-lede">
          I have been informed and understand
        </strong>{' '}
        that the information requested in this and any later interviews is
        requested under the authorization of Title 38, United States Code of
        Federal Regulations 1.576, Veterans Benefits. This information is needed
        to assist in vocational and educational planning, to authorize my
        receipt of rehabilitation services, to develop a record of my vocational
        progress, and to assure I obtain the best results from my rehabilitation
        program. I understand that the information I provide will not be used
        for any other purpose and that my responses may be disclosed outside VA
        only if the disclosure is authorized under the Privacy Act of 1974,
        including the routine uses identified in the VA system of records,
        58VA21/22/28, Compensation, Pension, Education and Veteran Readiness and
        Employment Records - VA, published in the Federal Register. Generally,
        disclosures under the authority of a routine use will be made to develop
        my claim for vocational rehabilitation benefits under Title 38, United
        States Code.
      </p>
      <p>
        My giving the requested information is voluntary. I understand that the
        following results might occur if I do not give this information:
      </p>
      <ol>
        <li>
          I may not receive the maximum benefit either from counseling or from
          my education or rehabilitation program.
        </li>
        <li>
          If certain information is required before I may enter a VA program, my
          failure to give the information may result in my not receiving the
          education or rehabilitation benefit for which I have applied.
        </li>
        <li>
          If I am in a program in which information on my progress is required,
          my failure to give this information may result in my not receiving
          further benefits or services. My failure to give this information will
          not have a negative effect on any other benefit to which I may be
          entitled.
        </li>
      </ol>
      <VaCheckbox
        required
        onVaChange={handleCheck}
        label="I acknowledge I have read the Protection of Privacy Information Statement."
        error={error}
        data-testid="privacy-agreement-checkbox"
      />
    </fieldset>
  );
};

ProtectionOfPrivacyStatement.propTypes = {
  hasSubmittedForm: PropTypes.bool.isRequired,
  isChecked: PropTypes.bool.isRequired,
  setIsChecked: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
};

export default ProtectionOfPrivacyStatement;
