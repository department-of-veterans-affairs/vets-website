import PropTypes from 'prop-types';
import React from 'react';

import { RadioField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { hasAlternateNamesSchema } from '@bio-aquia/21p-530a-interment-allowance/schemas';
import { z } from 'zod';

/**
 * Schema for veteran served under different name page
 */
const veteranServedUnderDifferentNameSchema = z.object({
  veteranServedUnderDifferentName: hasAlternateNamesSchema,
});

/**
 * Veteran Served Under Different Name page component for the interment allowance form.
 * Asks if the veteran served under a different name to conditionally show the previous names page.
 * This is part of the "Military history" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Veteran served under different name form page
 *
 * @example
 * ```jsx
 * <VeteranServedUnderDifferentNamePage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const VeteranServedUnderDifferentNamePage = ({
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
      title="Previous names"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={veteranServedUnderDifferentNameSchema}
      sectionName="veteranServedUnderDifferentName"
      defaultData={{
        veteranServedUnderDifferentName: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <RadioField
          name="veteranServedUnderDifferentName"
          label="Did the Veteran serve under another name?"
          value={localData.veteranServedUnderDifferentName}
          onChange={handleFieldChange}
          schema={hasAlternateNamesSchema}
          tile
          options={[
            {
              value: 'yes',
              label: 'Yes',
              description: "You'll need to add at least one other name.",
            },
            { value: 'no', label: 'No', description: '' },
          ]}
          error={errors.veteranServedUnderDifferentName}
          forceShowError={formSubmitted}
          required
        />
      )}
    </PageTemplate>
  );
};

VeteranServedUnderDifferentNamePage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
