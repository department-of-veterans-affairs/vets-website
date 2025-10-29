import PropTypes from 'prop-types';
import React from 'react';

import {
  MemorableDateField,
  TextInputField,
} from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import { z } from 'zod';
import { dateOfBirthSchema, placeOfBirthSchema } from '../../schemas';

/**
 * Schema for veteran birth information page
 */
const veteranBirthDeathSchema = z.object({
  dateOfBirth: dateOfBirthSchema,
  placeOfBirth: placeOfBirthSchema,
});

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfBirth']);
};

/**
 * Veteran Birth Information page component for the interment allowance form
 * This page collects deceased veteran's birth information
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Veteran birth information form page
 */
export const VeteranBirthDeathInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Veteran's birth information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={veteranBirthDeathSchema}
      sectionName="veteranIdentification"
      dataProcessor={ensureDateStrings}
      defaultData={{
        dateOfBirth: '',
        placeOfBirth: {
          city: '',
          state: '',
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <MemorableDateField
            name="dateOfBirth"
            label="Date of birth"
            schema={dateOfBirthSchema}
            value={localData.dateOfBirth}
            onChange={handleFieldChange}
            required
            error={errors.dateOfBirth}
            forceShowError={formSubmitted}
          />

          <TextInputField
            name="placeOfBirth.city"
            label="City of birth"
            value={localData.placeOfBirth?.city}
            onChange={handleFieldChange}
            required
            error={errors['placeOfBirth.city']}
            forceShowError={formSubmitted}
            schema={placeOfBirthSchema.shape.city}
          />

          <TextInputField
            name="placeOfBirth.state"
            label="State of birth"
            value={localData.placeOfBirth?.state}
            onChange={handleFieldChange}
            required
            error={errors['placeOfBirth.state']}
            forceShowError={formSubmitted}
            schema={placeOfBirthSchema.shape.state}
          />
        </>
      )}
    </PageTemplate>
  );
};

VeteranBirthDeathInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
