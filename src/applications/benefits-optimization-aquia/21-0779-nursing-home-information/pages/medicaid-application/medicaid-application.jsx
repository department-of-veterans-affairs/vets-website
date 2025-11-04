import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  medicaidApplicationSchema,
  medicaidApplicationStatusSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/medicaid-application';

// Schema for radio field - allows empty strings and valid values
const medicaidApplicationFieldSchema = z.union([
  z.literal(''),
  medicaidApplicationStatusSchema,
]);

/**
 * Medicaid Application page component for the nursing home information form
 * This page asks if the patient has applied for Medicaid
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Medicaid application form page
 */
export const MedicaidApplicationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Medicaid application status"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={medicaidApplicationSchema}
      sectionName="medicaidApplication"
      defaultData={{
        hasAppliedForMedicaid: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            name="hasAppliedForMedicaid"
            label="Has the patient applied for Medicaid?"
            schema={medicaidApplicationFieldSchema}
            value={localData.hasAppliedForMedicaid}
            onChange={handleFieldChange}
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ]}
            required
            error={errors.hasAppliedForMedicaid}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

MedicaidApplicationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
