import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  isCurrentlyHospitalizedSchema,
  hospitalizationStatusPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Hospitalization Status Page
 * Step 4 Page 1 - Determine if claimant is hospitalized
 * @module pages/hospitalization-status
 */
export const HospitalizationStatusPage = ({
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
      title={`Is ${claimantName} hospitalized?`}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationStatusPageSchema}
      sectionName="hospitalizationStatus"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        isCurrentlyHospitalized: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            label={`Is ${claimantName} hospitalized?`}
            name="isCurrentlyHospitalized"
            value={localData.isCurrentlyHospitalized || ''}
            onChange={handleFieldChange}
            schema={isCurrentlyHospitalizedSchema}
            options={[
              {
                label: 'Yes',
                value: 'yes',
              },
              {
                label: 'No',
                value: 'no',
              },
            ]}
            error={errors.isCurrentlyHospitalized}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplate>
  );
};

HospitalizationStatusPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
