import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { relationshipToVeteranSchema } from '@bio-aquia/21p-530a-interment-allowance/schemas';
import { z } from 'zod';

/**
 * Schema for relationship to veteran page
 */
const relationshipToVeteranPageSchema = z.object({
  relationshipToVeteran: relationshipToVeteranSchema,
});

/**
 * Relationship to Veteran page component for the interment allowance form.
 * Asks whether the applicant is from a state cemetery or tribal organization.
 * This is the first page in the form.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Relationship to veteran form page
 *
 * @example
 * ```jsx
 * <RelationshipToVeteranPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const RelationshipToVeteranPage = ({
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
      title="Relationship to the Veteran"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={relationshipToVeteranPageSchema}
      sectionName="relationshipToVeteran"
      defaultData={{
        relationshipToVeteran: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <RadioField
            name="relationshipToVeteran"
            label="What is your relationship to the Veteran?"
            value={localData.relationshipToVeteran}
            onChange={handleFieldChange}
            required
            error={errors.relationshipToVeteran}
            forceShowError={formSubmitted}
            schema={relationshipToVeteranSchema}
            options={[
              { value: 'state_cemetery', label: "I'm from a state cemetery" },
              {
                value: 'tribal_organization',
                label: "I'm from a tribal organization",
              },
            ]}
          />
        </>
      )}
    </PageTemplate>
  );
};

RelationshipToVeteranPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
