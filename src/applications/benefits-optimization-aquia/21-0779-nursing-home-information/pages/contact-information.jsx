import PropTypes from 'prop-types';
import React from 'react';

import { FormField, PhoneField } from '@bio-aquia/shared/components/atoms';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { contactInfoSchema, emailSchema, phoneSchema } from '../schemas';

/**
 * Contact Information page component for the nursing home information form
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Contact information form page
 */
export const ContactInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  return (
    <PageTemplate
      title="Contact Information"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={contactInfoSchema}
      sectionName="contactInfo"
      defaultData={{
        phone: '',
        email: '',
      }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <PhoneField
            name="phone"
            label="Phone number"
            schema={phoneSchema}
            value={localData.phone}
            onChange={handleFieldChange}
            hint="10-digit phone number"
            error={errors.phone}
            forceShowError={formSubmitted}
          />

          <FormField
            name="email"
            label="Email address"
            schema={emailSchema}
            value={localData.email}
            onChange={handleFieldChange}
            hint="We'll use this to send you updates about your application"
            error={errors.email}
            forceShowError={formSubmitted}
            type="email"
          />
        </>
      )}
    </PageTemplate>
  );
};

ContactInformationPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
