import PropTypes from 'prop-types';
import React from 'react';

import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { SSNField } from '@bio-aquia/shared/components/atoms';

import {
  claimantSSNSchema,
  claimantSSNPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

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

  return (
    <PageTemplate
      title="Claimant Social Security number"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantSSNPageSchema}
      sectionName="claimantSSN"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
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
    </PageTemplate>
  );
};

ClaimantSSNPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onReviewPage: PropTypes.bool,
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
