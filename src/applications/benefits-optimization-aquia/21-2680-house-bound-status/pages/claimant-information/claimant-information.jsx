import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { MemorableDateField } from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { transformDates } from '@bio-aquia/shared/forms';

import {
  claimantDOBSchema,
  claimantInformationPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

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

  return (
    <PageTemplate
      title="Claimant information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantInformationPageSchema}
      sectionName="claimantInformation"
      dataProcessor={ensureDateStrings}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
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
          <p>
            Enter your information as the person filing on behalf of the
            Veteran.
          </p>

          <FullnameField
            fieldPrefix="claimant"
            value={localData.claimantFullName}
            onChange={handleFieldChange}
            errors={errors.claimantFullName || {}}
            forceShowError={formSubmitted}
            required
            label="Claimant's full name"
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
    </PageTemplate>
  );
};

ClaimantInformationPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
