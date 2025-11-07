import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplateWithSaveInProgress } from '@bio-aquia/shared/components/templates';

import {
  claimantRelationshipSchema,
  claimantRelationshipPageSchema,
} from '@bio-aquia/21-2680-house-bound-status/schemas';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Claimant Relationship Page
 * Asks who the claim is for (Veteran, spouse, child, or parent)
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
    <PageTemplateWithSaveInProgress
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={claimantRelationshipPageSchema}
      sectionName="claimantRelationship"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      formConfig={formConfig}
      defaultData={{}}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            label="Who is the claim for?"
            name="relationship"
            value={localData.relationship}
            onChange={handleFieldChange}
            schema={claimantRelationshipSchema}
            options={[
              { label: 'Veteran', value: 'veteran' },
              { label: "Veteran's spouse", value: 'spouse' },
              { label: "Veteran's child", value: 'child' },
              { label: "Veteran's parent", value: 'parent' },
            ]}
            error={errors.relationship}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplateWithSaveInProgress>
  );
};

ClaimantRelationshipPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
