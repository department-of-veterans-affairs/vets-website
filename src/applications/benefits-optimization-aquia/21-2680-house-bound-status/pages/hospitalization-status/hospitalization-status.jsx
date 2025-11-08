import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';

import {
  isCurrentlyHospitalizedSchema,
  hospitalizationStatusPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

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
    ? 'Are you hospitalized?'
    : `Is ${formattedName} hospitalized?`;

  return (
    <PageTemplateWithSaveInProgress
      title={pageTitle}
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={hospitalizationStatusPageSchema}
      sectionName="hospitalizationStatus"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{}}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            label="Hospitalization status"
            name="isCurrentlyHospitalized"
            value={localData.isCurrentlyHospitalized}
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
    </PageTemplateWithSaveInProgress>
  );
};

HospitalizationStatusPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
