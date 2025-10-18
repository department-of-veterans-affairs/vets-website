import PropTypes from 'prop-types';
import React from 'react';

import {
  FormField,
  MemorableDateField,
  SSNField,
} from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  dateOfBirthSchema,
  dateOfDeathSchema,
  placeOfBirthSchema,
  serviceNumberSchema,
  ssnSchema,
  vaFileNumberSchema,
  veteranIdentificationSchema,
} from '../schemas';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfBirth', 'dateOfDeath']);
};

/**
 * Veteran Identification page component for the interment allowance form
 * This page collects deceased veteran's personal identification information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Veteran identification form page
 */
export const VeteranIdentificationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Deceased veteran's information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={veteranIdentificationSchema}
      sectionName="veteranIdentification"
      dataProcessor={ensureDateStrings}
      defaultData={{
        fullName: {
          first: '',
          middle: '',
          last: '',
        },
        ssn: '',
        serviceNumber: '',
        vaFileNumber: '',
        dateOfBirth: '',
        placeOfBirth: {
          city: '',
          state: '',
        },
        dateOfDeath: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p className="vads-u-margin-bottom--3">
            Please provide the following information about the deceased veteran
            for whom the interment allowance is being claimed.
          </p>

          <FullnameField
            name="fullName"
            value={localData.fullName}
            onChange={handleFieldChange}
            errors={errors}
            forceShowError={formSubmitted}
            label="Veteran's full name"
            required
          />

          <SSNField
            name="ssn"
            label="Veteran's Social Security Number"
            schema={ssnSchema}
            value={localData.ssn}
            onChange={handleFieldChange}
            required
            error={errors.ssn}
            forceShowError={formSubmitted}
          />

          <FormField
            name="serviceNumber"
            label="Veteran's service number (if different from SSN)"
            value={localData.serviceNumber}
            onChange={handleFieldChange}
            error={errors.serviceNumber}
            forceShowError={formSubmitted}
            hint="Leave blank if the same as Social Security Number"
            schema={serviceNumberSchema}
          />

          <FormField
            name="vaFileNumber"
            label="Veteran's VA file number"
            value={localData.vaFileNumber}
            onChange={handleFieldChange}
            error={errors.vaFileNumber}
            forceShowError={formSubmitted}
            hint="If known"
            schema={vaFileNumberSchema}
          />

          <MemorableDateField
            name="dateOfBirth"
            label="Veteran's date of birth"
            schema={dateOfBirthSchema}
            value={localData.dateOfBirth}
            onChange={handleFieldChange}
            required
            error={errors.dateOfBirth}
            forceShowError={formSubmitted}
          />

          <va-fieldset className="vads-u-margin-y--2">
            <legend className="schemaform-block-title">Place of birth</legend>

            <FormField
              name="placeOfBirth.city"
              label="City"
              value={localData.placeOfBirth?.city}
              onChange={handleFieldChange}
              required
              error={errors['placeOfBirth.city']}
              forceShowError={formSubmitted}
              schema={placeOfBirthSchema.shape.city}
            />

            <FormField
              name="placeOfBirth.state"
              label="State"
              value={localData.placeOfBirth?.state}
              onChange={handleFieldChange}
              required
              error={errors['placeOfBirth.state']}
              forceShowError={formSubmitted}
              schema={placeOfBirthSchema.shape.state}
            />
          </va-fieldset>

          <MemorableDateField
            name="dateOfDeath"
            label="Veteran's date of death"
            schema={dateOfDeathSchema}
            value={localData.dateOfDeath}
            onChange={handleFieldChange}
            required
            error={errors.dateOfDeath}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranIdentificationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
