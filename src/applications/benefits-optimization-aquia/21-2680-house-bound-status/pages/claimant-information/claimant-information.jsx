import PropTypes from 'prop-types';
import React from 'react';

import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  claimantDOBSchema,
  claimantInformationPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Data processor to ensure date values are properly formatted strings
 */
const ensureDateStrings = formData => {
  return transformDates(formData, ['claimantDOB']);
};

/**
 * Claimant Information Page
 * Collects claimant's name and date of birth
 * @module pages/claimant-information
 */
export const ClaimantInformationPage = ({
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
  const existingData = formDataToUse?.claimantInformation || {};
  const migratedData = {
    ...formDataToUse,
    claimantInformation: {
      ...(existingData.claimantFullName && {
        claimantFullName: existingData.claimantFullName,
      }),
      claimantDOB: existingData.claimantDOB || existingData.claimantDob || '',
    },
  };

  const relationship = migratedData?.claimantRelationship?.relationship;

  /**
   * Get the appropriate description text based on relationship
   */
  const getDescription = () => {
    switch (relationship) {
      case 'veteran':
        return 'Enter your information.';
      case 'spouse':
        return "Enter your spouse's information.";
      case 'child':
        return "Enter your child's information.";
      case 'parent':
        return "Enter your parent's information.";
      default:
        return 'Enter your information as the person filing on behalf of the Veteran.';
    }
  };

  return (
    <PageTemplateWithSaveInProgress
      data={migratedData}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantInformationPageSchema}
      sectionName="claimantInformation"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{
        claimantFullName: {
          first: '',
          middle: '',
          last: '',
        },
        claimantDOB: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <p>{getDescription()}</p>

          <FullnameField
            fieldPrefix="claimant"
            value={localData.claimantFullName}
            onChange={handleFieldChange}
            errors={errors.claimantFullName || {}}
            forceShowError={formSubmitted}
            required
            showSuffix={false}
          />

          <MemorableDateField
            label="Date of birth"
            name="claimantDOB"
            value={localData.claimantDOB || ''}
            onChange={handleFieldChange}
            error={errors.claimantDOB}
            forceShowError={formSubmitted}
            required
            schema={claimantDOBSchema}
          />
        </>
      )}
    </PageTemplateWithSaveInProgress>
  );
};

ClaimantInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
