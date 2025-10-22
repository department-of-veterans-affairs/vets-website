import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { transformDates } from '@bio-aquia/shared/forms';

import { hospitalizationDatePageSchema } from '@bio-aquia/21-2680-house-bound-status/schemas';

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

  // Get claimant name from previous pages
  const claimantName = formDataToUse.claimantFullName?.first || 'the claimant';

  return (
    <PageTemplate
      title={`When was ${claimantName} admitted to the hospital?`}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationDatePageSchema}
      sectionName="hospitalizationDate"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
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
            error={errors.admissionDate}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplate>
  );
};

HospitalizationDatePage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
