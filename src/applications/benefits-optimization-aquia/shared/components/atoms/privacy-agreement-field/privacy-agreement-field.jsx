import PropTypes from 'prop-types';
import React from 'react';

import { useFieldValidation } from '../../../hooks/use-field-validation';

/**
 * Privacy agreement and certification field component using VA web components
 * Provides privacy statement display with checkbox confirmation
 *
 * @component
 * @see [VA Checkbox](https://design.va.gov/components/form/checkbox)
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} [props.label] - Label text for the agreement checkbox
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation
 * @param {boolean} props.value - Current agreement status (true/false)
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {boolean} [props.showPrivacyAct=true] - Show full Privacy Act statement
 * @param {boolean} [props.required=true] - Whether agreement is required
 * @param {string} [props.error] - External error message to display
 * @returns {JSX.Element} VA privacy agreement component with validation
 */
export const PrivacyAgreementField = ({
  name,
  label = 'I certify that the information provided is true and correct to the best of my knowledge',
  schema,
  value,
  onChange,
  showPrivacyAct = true,
  required = true,
  error: externalError,
}) => {
  const {
    validateField,
    touchField,
    error: validationError,
    isValidating,
  } = useFieldValidation(schema);

  const displayError = externalError || validationError;

  const handleChange = e => {
    const checked = e?.detail?.checked ?? e?.target?.checked ?? false;
    onChange(name, checked);
  };

  const handleBlur = () => {
    touchField();
    validateField(value, true);
  };

  return (
    <div className="privacy-agreement-field vads-u-margin-bottom--2">
      {showPrivacyAct && (
        <div className="vads-u-margin-bottom--3">
          <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--1">
            Privacy Act Statement
          </h3>
          <div className="vads-u-background-color--gray-lightest vads-u-padding--2">
            <p className="vads-u-margin-top--0">
              <strong>Privacy Act Notice:</strong> VA is asking you to provide
              the information on this form under 38 U.S.C. Chapter 23 in order
              to determine your eligibility for burial flag benefits.
              Information you supply may be verified from other sources as
              authorized by law. VA may disclose the information that you
              provide as permitted by law.
            </p>
            <p className="vads-u-margin-bottom--0">
              <strong>Respondent Burden:</strong> We need this information to
              determine your eligibility for a burial flag (38 U.S.C. 2301).
              Title 38, United States Code, allows us to ask for this
              information. We estimate that you will need an average of 10
              minutes to review the instructions, find the information, and
              complete this form. VA cannot conduct or sponsor a collection of
              information unless a valid OMB control number is displayed. You
              are not required to respond to a collection of information if this
              number is not displayed. Valid OMB control numbers can be located
              on the OMB Internet Page at www.reginfo.gov/public/do/PRAMain.
            </p>
          </div>
        </div>
      )}

      <div className="vads-u-margin-top--2">
        <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--1">
          Certification and Authorization
        </h3>

        <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--2">
          <p className="vads-u-margin-top--0">
            <strong>Penalty Statement:</strong> Knowingly making a false
            statement or claim to obtain a United States flag for burial
            purposes is punishable by fine or imprisonment, or both, under 18
            U.S.C. 1001.
          </p>

          <p className="vads-u-margin-bottom--0">
            By checking the box below, you certify that:
          </p>
          <ul className="vads-u-margin-bottom--0">
            <li>
              The information provided in this application is true and correct
            </li>
            <li>The deceased veteran is eligible for a burial flag</li>
            <li>You understand the penalty for making false statements</li>
          </ul>
        </div>

        <va-checkbox
          name={name}
          label={label}
          checked={value || false}
          required={required}
          error={displayError}
          onVaChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={isValidating ? `${name}-validating` : undefined}
        />
      </div>
    </div>
  );
};

PrivacyAgreementField.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  showPrivacyAct: PropTypes.bool,
  value: PropTypes.bool,
};
