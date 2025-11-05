import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import {
  claimantQuestionSchema,
  patientTypeSchema,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/claimant-question';

// Schema for patientType radio field - used for real-time field validation
// This allows empty strings and valid values
const patientTypeFieldSchema = z.union([z.literal(''), patientTypeSchema]);

/**
 * Claimant Question page component for the nursing home information form
 * This page asks who is the patient in the nursing home facility
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Claimant question form page
 */
export const ClaimantQuestionPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Patient information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantQuestionSchema}
      sectionName="claimantQuestion"
      defaultData={{
        patientType: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            name="patientType"
            label="Who is the patient in the nursing home facility?"
            schema={patientTypeFieldSchema}
            value={localData.patientType}
            onChange={handleFieldChange}
            options={[
              { label: 'A Veteran', value: 'veteran' },
              {
                label: 'The spouse or parent of a Veteran',
                value: 'spouseOrParent',
              },
            ]}
            required
            error={errors.patientType}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

ClaimantQuestionPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
