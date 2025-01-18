import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { validateAddress } from 'platform/user/profile/vap-svc/actions';
import set from 'platform/utilities/data/set';
import AddressConfirmation from '../../components/AddressConfirmation';
import SuggestedAddressRadio from '../../components/SuggestedAddressRadio';
import { shouldShowSuggestedAddress } from '../../utils/helpers';

function SponsorSuggestedAddress({ formData, addressValidation }) {
  const dispatch = useDispatch();
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedAddress, setSuggestedAddress] = useState(null);

  const extractUserAddress = () => {
    return formData?.application?.veteran?.address || {};
  };

  // Prepare address for API Request
  const prepareAddressForAPI = address => ({
    addressLine1: address.street,
    addressLine2: address.street2,
    addressPou: 'CORRESPONDENCE',
    addressType: 'DOMESTIC',
    city: address.city,
    countryCodeIso3: address.country,
    stateCode: address.state,
    zipCode: address.postalCode,
  });

  useEffect(() => {
    async function fetchSuggestedAddresses() {
      try {
        const formDataUserAddress = extractUserAddress();
        setUserAddress(formDataUserAddress);
        setSelectedAddress(formDataUserAddress);

        await dispatch(
          validateAddress(
            '/profile/addresses',
            'POST',
            'mailingAddress',
            prepareAddressForAPI(formDataUserAddress),
            'mailing-address',
          ),
        );
      } catch (error) {
        setIsLoading(true); // This is temporary, send it to address confirmation screen instead
      }
    }
    fetchSuggestedAddresses();
  }, []);

  useEffect(
    () => {
      if (addressValidation?.addressFromUser?.addressLine1) setIsLoading(false);
    },
    [addressValidation],
  );

  // Update suggested address when addressValidation changes
  useEffect(
    () => {
      setSuggestedAddress(addressValidation?.confirmedSuggestions[0]);
    },
    [addressValidation],
  );

  // Handle Address Selection Change
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
      'application.veteran.address',
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

  return shouldShowSuggestedAddress(suggestedAddress, userAddress) ? (
    <SuggestedAddressRadio
      title="Confirm sponsor mailing address"
      userAddress={userAddress}
      selectedAddress={selectedAddress}
      addressValidation={addressValidation}
      onChangeSelectedAddress={onChangeSelectedAddress}
    />
  ) : (
    <AddressConfirmation
      subHeader="Check sponsor mailing address"
      userAddress={userAddress}
    />
  );
}

// Map state to props
const mapStateToProps = state => ({
  formData: state?.form?.data,
  addressValidation: state?.vapService?.addressValidation,
});

export default connect(mapStateToProps)(SponsorSuggestedAddress);
