import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';
import { SSNField } from '@bio-aquia/shared/components/atoms';

import {
  claimantSSNSchema,
  claimantSSNPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Claimant SSN Page
 * Collects claimant's Social Security Number
 * @module pages/claimant-ssn
 */
export const ClaimantSSNPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Migrate old field names to new field names for backward compatibility
  const migratedData = {
    ...formDataToUse,
    claimantSSN: {
      claimantSSN:
        formDataToUse?.claimantSSN?.claimantSSN ||
        formDataToUse?.claimantSSN?.claimantSsn ||
        formDataToUse?.claimantSsn?.claimantSSN ||
        formDataToUse?.claimantSsn?.claimantSsn ||
        '',
    },
  };

  // Get claimant's name from form data
  const claimantName = migratedData?.claimantInformation?.claimantFullName;
  const firstName = claimantName?.first || '';
  const lastName = claimantName?.last || '';

  // Format the name for display
  const formattedName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || 'Claimant';

  const pageTitle = `${formattedName}'s Social Security number`;

  return (
    <PageTemplateWithSaveInProgress
      title={pageTitle}
      data={migratedData}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantSSNPageSchema}
      sectionName="claimantSSN"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{
        claimantSSN: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <SSNField
            label="Social Security number"
            name="claimantSSN"
            value={localData.claimantSSN || ''}
            onChange={handleFieldChange}
            error={errors.claimantSSN}
            forceShowError={formSubmitted}
            required
            schema={claimantSSNSchema}
          />
        </>
      )}
    </PageTemplateWithSaveInProgress>
  );
};

ClaimantSSNPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
