import PropTypes from 'prop-types';
import React from 'react';

import { DateField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  medicaidStartDateInfoSchema,
  medicaidStartDateSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/medicaid-start-date';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['medicaidStartDate']);
};

/**
 * Medicaid Start Date page component for the nursing home information form
 * This page asks when the patient's Medicaid plan began
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Medicaid start date form page
 */
export const MedicaidStartDatePage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Medicaid start date"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={medicaidStartDateInfoSchema}
      sectionName="medicaidStartDateInfo"
      dataProcessor={ensureDateStrings}
      defaultData={{
        medicaidStartDate: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <DateField
            name="medicaidStartDate"
            label="When did the patient's Medicaid plan begin?"
            schema={medicaidStartDateSchema}
            value={localData.medicaidStartDate}
            onChange={handleFieldChange}
            required
            error={errors.medicaidStartDate}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

MedicaidStartDatePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
