import PropTypes from 'prop-types';
import React from 'react';

import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { organizationNameSchema } from '@bio-aquia/21p-530a-interment-allowance/schemas';

/**
 * Schema for organization information page
 */
const organizationInformationPageSchema = z.object({
  organizationName: organizationNameSchema,
});

/**
 * Organization Information page component for the interment allowance form.
 * Collects the name of the state cemetery or tribal organization claiming the interment allowance.
 * This is the first page in the "Your organization's information" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Organization information form page
 *
 * @example
 * ```jsx
 * <OrganizationInformationPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const OrganizationInformationPage = ({
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
      title="Organization information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={organizationInformationPageSchema}
      sectionName="organizationInformation"
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      defaultData={{
        organizationName: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <TextInputField
            name="organizationName"
            label="Organization name"
            value={localData.organizationName}
            onChange={handleFieldChange}
            required
            error={errors.organizationName}
            forceShowError={formSubmitted}
            schema={organizationNameSchema}
          />
        </>
      )}
    </PageTemplate>
  );
};

OrganizationInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
