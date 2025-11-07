import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  hospitalizationDatePageSchema,
  admissionDateFieldSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['admissionDate']);
};

/**
 * Hospitalization Date Page
 * Step 4 Page 2 - Admission date for hospitalized claimant
 * @module pages/hospitalization-date
 */
export const HospitalizationDatePage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Get claimant information for dynamic title
  const relationship = formDataToUse?.claimantRelationship?.relationship;
  const isVeteran = relationship === 'veteran';
  const claimantName = formDataToUse?.claimantInformation?.claimantFullName;
  const firstName = claimantName?.first || '';
  const lastName = claimantName?.last || '';

  // Format the name for display
  const formattedName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || 'the claimant';

  const pageTitle = isVeteran
    ? 'When were you admitted to the hospital?'
    : `When was ${formattedName} admitted to the hospital?`;

  return (
    <PageTemplateWithSaveInProgress
      title={pageTitle}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationDatePageSchema}
      sectionName="hospitalizationDate"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{
        admissionDate: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <MemorableDateField
            label="Admission date"
            name="admissionDate"
            value={localData.admissionDate || ''}
            onChange={handleFieldChange}
            schema={admissionDateFieldSchema}
            error={errors.admissionDate}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplateWithSaveInProgress>
  );
};

HospitalizationDatePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
