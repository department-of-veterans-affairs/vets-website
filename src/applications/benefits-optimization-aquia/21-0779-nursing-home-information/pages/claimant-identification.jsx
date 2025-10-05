import PropTypes from 'prop-types';
import React from 'react';

import {
  FormField,
  MemorableDateField,
  RadioField,
  SSNField,
} from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import { z } from 'zod';
import {
  claimantIdentificationSchema,
  dateOfBirthSchema,
  ssnSchema,
  vaFileNumberSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas';

// Schema for isVeteran radio field - used for real-time field validation
// This allows empty strings and valid values
const isVeteranSchema = z.union([z.literal(''), z.enum(['yes', 'no'])]);

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['claimantDateOfBirth']);
};

/**
 * Claimant Identification page component for the nursing home information form
 * This page is shown when the claimant is not the veteran (e.g., spouse or dependent)
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Claimant identification form page
 */
export const ClaimantIdentificationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Claimant identification"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantIdentificationSchema}
      sectionName="claimantIdentification"
      dataProcessor={ensureDateStrings}
      defaultData={{
        isVeteran: 'yes',
        claimantFullName: { first: '', middle: '', last: '' },
        claimantDateOfBirth: '',
        claimantSsn: '',
        claimantVaFileNumber: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            name="isVeteran"
            label="Is the claimant the Veteran?"
            schema={isVeteranSchema}
            value={localData.isVeteran}
            onChange={handleFieldChange}
            options={[
              { label: 'Yes', value: 'yes' },
              {
                label: 'No, the claimant is a spouse or dependent',
                value: 'no',
              },
            ]}
            required
            error={errors.isVeteran}
            forceShowError={formSubmitted}
          />

          {localData.isVeteran === 'no' && (
            <>
              <va-additional-info
                trigger="Why we ask for claimant information"
                class="vads-u-margin-y--2"
              >
                <p>
                  If the person in the nursing home is a spouse or dependent of
                  a Veteran, we need their information to process the Aid and
                  Attendance claim.
                </p>
              </va-additional-info>

              <FullnameField
                value={localData.claimantFullName}
                onChange={handleFieldChange}
                errors={
                  errors.claimantFullName &&
                  typeof errors.claimantFullName === 'object' &&
                  !Array.isArray(errors.claimantFullName)
                    ? errors.claimantFullName
                    : {}
                }
                required
                showSuffix={false}
                forceShowError={formSubmitted}
                label="Claimant's full name"
                fieldPrefix="claimant"
              />

              <MemorableDateField
                name="claimantDateOfBirth"
                label="Claimant's date of birth"
                schema={dateOfBirthSchema}
                value={localData.claimantDateOfBirth}
                onChange={handleFieldChange}
                required
                hint="Enter the date as MM/DD/YYYY"
                error={errors.claimantDateOfBirth}
                forceShowError={formSubmitted}
              />

              <SSNField
                name="claimantSsn"
                label="Claimant's Social Security number"
                schema={ssnSchema}
                value={localData.claimantSsn}
                onChange={handleFieldChange}
                required
                error={errors.claimantSsn}
                forceShowError={formSubmitted}
              />

              <FormField
                name="claimantVaFileNumber"
                label="Claimant's VA file number (if known)"
                schema={vaFileNumberSchema}
                value={localData.claimantVaFileNumber}
                onChange={handleFieldChange}
                hint="The claimant's VA file number may be the same as their SSN"
                error={errors.claimantVaFileNumber}
                forceShowError={formSubmitted}
              />
            </>
          )}
        </>
      )}
    </PageTemplate>
  );
};

ClaimantIdentificationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
