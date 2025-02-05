import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import set from 'platform/utilities/data/set';
import { focusElement } from 'platform/utilities/ui/focus';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import AddressConfirmation from '../../components/AddressConfirmation';
import SuggestedAddressRadio from '../../components/SuggestedAddressRadio';
import { isAuthorizedAgent, prepareAddressForAPI } from '../../utils/helpers';

export const envUrl = environment.API_URL;

function ApplicantSuggestedAddress({ formData }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const extractUserAddress = () => {
    return formData?.application?.claimant?.address || {};
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
          const suggested = res?.addresses[0]?.address;
          setSuggestedAddress({
            addressLine1: suggested.address_line1,
            addressLine2: suggested.address_line2 || '',
            city: suggested.city,
            country: suggested.country_code_iso3,
            state: suggested.state_code,
            zipCode: suggested.zip_code,
          });
          setShowSuggestions(
            res?.addresses[0]?.address_meta_data?.confidence_score !== 100,
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

  // Handle Address Selection Change
  const onChangeSelectedAddress = event => {
    const selected = JSON.parse(event.detail.value);
    setSelectedAddress(selected);
    let newAddress;
    if ('address_line1' in selected) {
      newAddress = {
        street: selected.address_line1,
        street2: selected.address_line2 || '',
        city: selected.city,
        country: selected.country_code_iso3,
        state: selected.state_code,
        postalCode: selected.zip_code,
      };
    } else {
      newAddress = selected;
    }
    const updatedFormData = set(
      'application.claimant.address',
      newAddress,
      formData,
    );
    dispatch(setData(updatedFormData));
  };

  if (isLoading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return showSuggestions ? (
    <SuggestedAddressRadio
      title={
        !isAuthorizedAgent(formData)
          ? 'Confirm your mailing address'
          : 'Confirm applicant mailing address'
      }
      userAddress={userAddress}
      selectedAddress={selectedAddress}
      suggestedAddress={suggestedAddress}
      onChangeSelectedAddress={onChangeSelectedAddress}
    />
  ) : (
    <AddressConfirmation
      subHeader={
        !isAuthorizedAgent(formData)
          ? 'Check your mailing address'
          : 'Check applicant mailing address'
      }
      userAddress={userAddress}
    />
  );
}

// Map state to props
const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(ApplicantSuggestedAddress);
