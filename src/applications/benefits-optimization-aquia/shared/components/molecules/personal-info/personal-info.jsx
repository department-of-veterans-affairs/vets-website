import PropTypes from 'prop-types';
import React from 'react';

import {
  emailAddressSchema as emailSchema,
  phoneNumberSchema as phoneSchema,
} from '../../../schemas/contact';
import {
  dateOfBirthSchema,
  ssnSchema,
  vaFileNumberSchema,
} from '../../../schemas/personal-info';
import {
  TextInputField,
  MemorableDateField,
  PhoneField,
  SSNField,
} from '../../atoms';
import { FullnameField } from '../fullname-field';

/**
 * Personal information component following VA patterns
 * Includes name, SSN, DOB, and contact information
 * Uses built-in schemas for field validation
 * @see [VA Text Input](https://design.va.gov/components/form/text-input)
 * @see [VA Date Input](https://design.va.gov/components/form/date-input)
 * @see [VA Telephone Input](https://design.va.gov/components/form/telephone-input)
 * @param {Object} props - Component props
 * @param {Object} props.value - Current personal info value
 * @param {Function} props.onChange - Change handler
 * @param {Object} props.errors - Validation errors
 * @param {boolean} [props.required=false] - Whether fields are required
 * @param {string} [props.legend='Personal information'] - Fieldset legend
 * @param {boolean} [props.showSSN=true] - Show SSN field
 * @param {boolean} [props.showPhone=true] - Show phone field
 * @param {boolean} [props.showEmail=true] - Show email field
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @returns {JSX.Element} Personal information fieldset
 */
export const PersonalInfo = ({
  value = {},
  onChange,
  errors = {},
  required = false,
  legend = 'Personal information',
  showSSN = true,
  showPhone = true,
  showEmail = true,
  forceShowError = false,
}) => {
  // Ensure value and errors are always objects, even if null/undefined is passed
  const safeValue = value || {};
  const safeErrors = errors || {};

  const handleFieldChange = (fieldName, fieldValue) => {
    if (fieldName.startsWith('fullName.')) {
      const namePart = fieldName.split('.')[1];
      const updatedName = {
        ...(safeValue.fullName || {}),
        [namePart]: fieldValue,
      };
      onChange({ ...safeValue, fullName: updatedName });
    } else {
      onChange({ ...safeValue, [fieldName]: fieldValue });
    }
  };

  return (
    <fieldset className="vads-u-margin-bottom--3">
      <legend className="vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin-bottom--2">
        {legend}
      </legend>

      <FullnameField
        value={safeValue.fullName}
        onChange={handleFieldChange}
        errors={safeErrors.fullName}
        required={required}
        showSuffix
        forceShowError={forceShowError}
        legend=""
      />

      {showSSN && (
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--6">
            <SSNField
              name="ssn"
              label="Social Security Number"
              value={safeValue.ssn}
              onChange={handleFieldChange}
              schema={ssnSchema}
              error={
                Array.isArray(safeErrors.ssn)
                  ? safeErrors.ssn[0]
                  : safeErrors.ssn
              }
              required={required}
              forceShowError={forceShowError}
            />
          </div>

          <div className="vads-l-col--12 medium-screen:vads-l-col--6">
            <TextInputField
              label="VA file number (if known)"
              name="vaFileNumber"
              value={safeValue.vaFileNumber || ''}
              error={
                Array.isArray(safeErrors.vaFileNumber)
                  ? safeErrors.vaFileNumber[0]
                  : safeErrors.vaFileNumber
              }
              hint="Your VA file number may be the same as your SSN"
              onChange={handleFieldChange}
              schema={vaFileNumberSchema}
              forceShowError={forceShowError}
              className="vads-u-margin-bottom--2"
            />
          </div>
        </div>
      )}

      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--6">
          <MemorableDateField
            name="dateOfBirth"
            label="Date of birth"
            value={safeValue.dateOfBirth}
            onChange={handleFieldChange}
            schema={dateOfBirthSchema}
            error={
              Array.isArray(safeErrors.dateOfBirth)
                ? safeErrors.dateOfBirth[0]
                : safeErrors.dateOfBirth
            }
            required={required}
            forceShowError={forceShowError}
          />
        </div>
      </div>

      {(showPhone || showEmail) && (
        <>
          <h3 className="vads-u-font-size--h4 vads-u-margin-top--2 vads-u-margin-bottom--1">
            Contact information
          </h3>

          <va-alert status="info" slim className="vads-u-margin-bottom--2">
            We’ll use this information to contact you about your application.
          </va-alert>

          <div className="vads-l-row">
            {showPhone && (
              <div className="vads-l-col--12 medium-screen:vads-l-col--6">
                <PhoneField
                  name="phone"
                  label="Phone number"
                  value={safeValue.phone}
                  onChange={handleFieldChange}
                  schema={phoneSchema}
                  error={
                    Array.isArray(safeErrors.phone)
                      ? safeErrors.phone[0]
                      : safeErrors.phone
                  }
                  required={required}
                  forceShowError={forceShowError}
                />
              </div>
            )}

            {showEmail && (
              <div className="vads-l-col--12 medium-screen:vads-l-col--6">
                <TextInputField
                  label="Email address"
                  name="email"
                  type="email"
                  value={safeValue.email || ''}
                  error={
                    Array.isArray(safeErrors.email)
                      ? safeErrors.email[0]
                      : safeErrors.email
                  }
                  required={required}
                  hint="We'll use this to send you updates"
                  onChange={handleFieldChange}
                  schema={emailSchema}
                  forceShowError={forceShowError}
                  className="vads-u-margin-bottom--2"
                />
              </div>
            )}
          </div>
        </>
      )}
    </fieldset>
  );
};

PersonalInfo.propTypes = {
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  forceShowError: PropTypes.bool,
  legend: PropTypes.string,
  required: PropTypes.bool,
  showEmail: PropTypes.bool,
  showPhone: PropTypes.bool,
  showSSN: PropTypes.bool,
  value: PropTypes.shape({
    dateOfBirth: PropTypes.string,
    email: PropTypes.string,
    fullName: PropTypes.shape({
      first: PropTypes.string,
      last: PropTypes.string,
      middle: PropTypes.string,
      suffix: PropTypes.string,
    }),
    phone: PropTypes.string,
    ssn: PropTypes.string,
    vaFileNumber: PropTypes.string,
  }),
};
