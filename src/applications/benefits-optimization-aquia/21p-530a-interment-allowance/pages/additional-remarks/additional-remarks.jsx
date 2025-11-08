import PropTypes from 'prop-types';
import React from 'react';

import { TextareaField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { remarksSchema } from '@bio-aquia/21p-530a-interment-allowance/schemas';

/**
 * Schema for additional remarks page
 */
const additionalRemarksPageSchema = z.object({
  additionalRemarks: remarksSchema,
});

/**
 * Additional Remarks page component for the interment allowance form.
 * Allows users to provide any additional information or comments relevant to the interment allowance claim.
 * This is the last page in the "Additional remarks" chapter before the review page.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Additional remarks form page
 *
 * @example
 * ```jsx
 * <AdditionalRemarksPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const AdditionalRemarksPage = ({
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
      title="Additional remarks"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={additionalRemarksPageSchema}
      sectionName="additionalRemarks"
      defaultData={{
        additionalRemarks: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <TextareaField
          name="additionalRemarks"
          label="Provide any additional remarks about your application"
          value={localData.additionalRemarks}
          onChange={handleFieldChange}
          error={errors.additionalRemarks}
          forceShowError={formSubmitted}
          schema={remarksSchema}
          rows={8}
          maxLength={1000}
          charCount
          hint="You have 1,000 characters maximum"
        />
      )}
    </PageTemplate>
  );
};

AdditionalRemarksPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
