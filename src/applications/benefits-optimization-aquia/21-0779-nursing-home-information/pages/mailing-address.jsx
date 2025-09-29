import PropTypes from 'prop-types';
import React from 'react';

import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

/**
 * Mailing Address page component for the nursing home information form
 * @param {Object} props - Component props
 * @param {Object} props.data - Initial form data
 * @param {Function} props.setFormData - Function to update form data
 * @param {Function} props.goForward - Function to proceed to next page
 * @returns {JSX.Element} Mailing address form page
 */
export const MailingAddressPage = ({
  data,
  setFormData,
  goForward,
  goBack,
}) => {
  const formDataToUse =
    data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  // Initialize mailing address with defaults
  const mailingAddress = {
    street: '',
    street2: '',
    street3: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    ...formDataToUse.mailingAddress,
  };

  // Handle address updates
  const handleAddressChange = (_, addressObject) => {
    setFormData({
      ...formDataToUse,
      mailingAddress: addressObject,
    });
  };

  // Simple validation for continue
  const handleContinue = () => {
    const hasRequiredFields =
      mailingAddress.street &&
      mailingAddress.city &&
      mailingAddress.state &&
      mailingAddress.postalCode;

    if (hasRequiredFields) {
      // goForward expects the form data as an argument
      goForward(formDataToUse);
    }
  };

  return (
    <PageTemplate
      title="Mailing Address"
      data={formDataToUse}
      setFormData={setFormData}
      goForward={handleContinue}
      goBack={goBack}
      useFormSectionHook={false} // Disable the hook-based validation
    >
      <AddressField
        name="mailingAddress"
        value={mailingAddress}
        onChange={handleAddressChange}
        label="Mailing address"
      />
    </PageTemplate>
  );
};

MailingAddressPage.propTypes = {
  goForward: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  goBack: PropTypes.func,
  setFormData: PropTypes.func,
};
