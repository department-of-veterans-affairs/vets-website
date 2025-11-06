import PropTypes from 'prop-types';
import React from 'react';

import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

import { z } from 'zod';
import { recipientAddressSchema } from '@bio-aquia/21p-530a-interment-allowance/schemas';

/**
 * Schema for mailing address page
 */
const mailingAddressSchema = z.object({
  recipientAddress: recipientAddressSchema,
});

/**
 * Mailing Address page component for the interment allowance form.
 * Collects the complete mailing address where the burial allowance payment should be sent.
 * This is the third page in the "Your organization's information" chapter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Initial form data from the form system
 * @param {Function} [props.goBack] - Function to navigate to the previous page
 * @param {Function} props.goForward - Function to navigate to the next page
 * @param {Function} [props.setFormData] - Function to update the form data in the form system
 * @returns {JSX.Element} Mailing address form page
 *
 * @example
 * ```jsx
 * <MailingAddressPage
 *   data={formData}
 *   goForward={handleGoForward}
 *   goBack={handleGoBack}
 *   setFormData={setFormData}
 * />
 * ```
 */
export const MailingAddressPage = ({
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
      title="Burial organization’s mailing address"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      onReviewPage={onReviewPage}
      updatePage={updatePage}
      schema={mailingAddressSchema}
      sectionName="mailingAddress"
      defaultData={{
        recipientAddress: {
          street: '',
          street2: '',
          street3: '',
          city: '',
          state: '',
          country: 'USA',
          postalCode: '',
          isMilitary: false,
        },
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <AddressField
            allowMilitary={false}
            omitStreet3
            name="recipientAddress"
            label=""
            value={localData.recipientAddress}
            onChange={handleFieldChange}
            schema={recipientAddressSchema}
            errors={
              formSubmitted && errors.recipientAddress
                ? {
                    street:
                      errors.recipientAddress.street ||
                      errors.recipientAddress?.street,
                    street2:
                      errors.recipientAddress.street2 ||
                      errors.recipientAddress?.street2,
                    city:
                      errors.recipientAddress.city ||
                      errors.recipientAddress?.city,
                    state:
                      errors.recipientAddress.state ||
                      errors.recipientAddress?.state,
                    country:
                      errors.recipientAddress.country ||
                      errors.recipientAddress?.country,
                    postalCode:
                      errors.recipientAddress.postalCode ||
                      errors.recipientAddress?.postalCode,
                  }
                : {}
            }
            touched={
              formSubmitted
                ? {
                    street: true,
                    street2: true,
                    street3: true,
                    city: true,
                    state: true,
                    country: true,
                    postalCode: true,
                  }
                : {}
            }
            required
          />
        </>
      )}
    </PageTemplate>
  );
};

MailingAddressPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
