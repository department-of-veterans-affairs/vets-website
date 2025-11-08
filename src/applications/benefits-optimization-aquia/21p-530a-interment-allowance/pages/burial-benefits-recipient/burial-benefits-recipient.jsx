import PropTypes from 'prop-types';
import React from 'react';

import { PhoneField, TextInputField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import {
  recipientNameSchema,
  recipientPhoneSchema,
} from '@bio-aquia/21p-530a-interment-allowance/schemas';

/**
 * Schema for burial benefits recipient page
 */
const burialBenefitsRecipientSchema = z.object({
  recipientOrganizationName: recipientNameSchema,
  recipientPhone: recipientPhoneSchema,
});

/**
 * Burial Benefits Recipient page component for the interment allowance form.
 * Collects contact information for the organization that will be receiving the burial allowance compensation.
 * This is the second page in the "Your organization's information" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Burial benefits recipient form page
 *
 * @example
 * ```jsx
 * <BurialBenefitsRecipientPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const BurialBenefitsRecipientPage = ({
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
      title="Burial benefits recipient"
      subtitle="This is the organization who will be receiving compensation."
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={burialBenefitsRecipientSchema}
      sectionName="burialBenefitsRecipient"
      defaultData={{
        recipientOrganizationName: '',
        recipientPhone: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <TextInputField
            name="recipientOrganizationName"
            label="Full name"
            value={localData.recipientOrganizationName}
            onChange={handleFieldChange}
            required
            error={errors.recipientOrganizationName}
            forceShowError={formSubmitted}
            schema={recipientNameSchema}
          />

          <PhoneField
            name="recipientPhone"
            label="Phone number"
            schema={recipientPhoneSchema}
            value={localData.recipientPhone}
            onChange={handleFieldChange}
            required
            error={errors.recipientPhone}
            forceShowError={formSubmitted}
          />
        </>
      )}
    </PageTemplate>
  );
};

BurialBenefitsRecipientPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
