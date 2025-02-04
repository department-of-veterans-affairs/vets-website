import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import set from 'platform/utilities/data/set';
import { focusElement } from 'platform/utilities/ui/focus';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import AddressConfirmation from '../../components/AddressConfirmation';
import SuggestedAddressRadio from '../../components/SuggestedAddressRadio';
import { prepareAddressForAPI } from '../../utils/helpers';

export const envUrl = environment.API_URL;

function PreparerSuggestedAddress({ formData }) {
  const dispatch = useDispatch();
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Extract address details from formData
  const extractUserAddress = () => {
    return (
      formData?.application?.applicant['view:applicantInfo']?.mailingAddress ||
      {}
    );
  };

  // Fetch suggested addresses when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const formDataUserAddress = extractUserAddress();
      setUserAddress(formDataUserAddress);
      setSelectedAddress(formDataUserAddress);

      const options = {
        body: JSON.stringify({
          address: { ...prepareAddressForAPI(formDataUserAddress) },
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        const res = await apiRequest(
          `${envUrl}/v0/profile/address_validation`,
          options,
        );

        if (res?.addresses && res?.addresses.length > 0) {
          setSuggestedAddress(res?.addresses[0]?.address);
          setShowSuggestions(
            res?.addresses[0]?.addressMetaData?.confidenceScore !== 100,
          );
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    focusElement('#address-validation-alert-heading');
  }, []);

  // Handle address selection changes
  const onChangeSelectedAddress = event => {
    const selected = JSON.parse(event.detail.value);
    setSelectedAddress(selected);

    let newAddress;
    if ('addressLine1' in selected) {
      newAddress = {
        street: selected.addressLine1,
        street2: selected.addressLine2,
        city: selected.city,
        country: selected.countryCodeIso3,
        state: selected.stateCode,
        postalCode: selected.zipCode,
      };
    } else {
      newAddress = selected;
    }

    const updatedFormData = set(
      'application.applicant[view:applicantInfo].mailingAddress',
      newAddress,
      formData,
    );

    dispatch(setData(updatedFormData));
  };

  // Render loading indicator or content
  if (isLoading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return showSuggestions ? (
    <SuggestedAddressRadio
      title="Confirm your mailing address"
      userAddress={userAddress}
      selectedAddress={selectedAddress}
      suggestedAddress={suggestedAddress}
      onChangeSelectedAddress={onChangeSelectedAddress}
    />
  ) : (
    <AddressConfirmation
      subHeader="Check your mailing address"
      userAddress={userAddress}
    />
  );
}

// Map state to props
const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(PreparerSuggestedAddress);
