import PropTypes from 'prop-types';
import React from 'react';

import {
  admissionDateInfoSchema,
  admissionDateSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/admission-date';
import { DateField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['admissionDate']);
};

/**
 * Admission Date page component for the nursing home information form
 * This page collects the date the patient was admitted to the nursing home
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Admission date form page
 */
export const AdmissionDatePage = ({ data, setFormData, goForward, goBack }) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Date of admission"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={admissionDateInfoSchema}
      sectionName="admissionDateInfo"
      dataProcessor={ensureDateStrings}
      defaultData={{
        admissionDate: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <DateField
            name="admissionDate"
            label="When was the patient admitted to the nursing home?"
            schema={admissionDateSchema}
            value={localData.admissionDate}
            onChange={handleFieldChange}
            required
            error={errors.admissionDate}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

AdmissionDatePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
