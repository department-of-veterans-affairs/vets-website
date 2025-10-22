import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import {
  claimantRelationshipPageSchema,
  claimantRelationshipSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';

/**
 * Claimant Relationship Page
 * Step 2 Page 1 - Determine who the claim is for
 * @module pages/claimant-relationship
 */
export const ClaimantRelationshipPage = ({
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
      title="Who is the claim for?"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantRelationshipPageSchema}
      sectionName="claimantRelationship"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        claimantRelationship: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            label="Who is the claim for?"
            name="claimantRelationship"
            value={localData.claimantRelationship || ''}
            onChange={handleFieldChange}
            schema={claimantRelationshipSchema}
            options={[
              {
                label: 'Veteran',
                value: 'veteran',
              },
              {
                label: "Veteran's spouse",
                value: 'spouse',
              },
              {
                label: "Veteran's child",
                value: 'child',
              },
              {
                label: "Veteran's parent",
                value: 'parent',
              },
            ]}
            error={errors.claimantRelationship}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplate>
  );
};

ClaimantRelationshipPage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  goForward: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
};
