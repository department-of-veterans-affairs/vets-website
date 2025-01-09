import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { validateAddress } from 'platform/user/profile/vap-svc/actions';
import set from 'platform/utilities/data/set';
import AddressConfirmation from './addressConfirmation';
import SuggestedAddressRadio from '../../components/SuggestedAddressRadio';

function PreparerSuggestedAddress({ formData, addressValidation }) {
  const dispatch = useDispatch();
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedAddress, setSuggestedAddress] = useState(null);

  // Extract address details from formData
  const extractUserAddress = () =>
    formData?.application?.applicant['view:applicantInfo']?.mailingAddress ||
    {};

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

  const shouldShowSuggestedAddress = () => {
    if (!suggestedAddress.addressLine1 || !userAddress.street) return false;
    return !(
      userAddress.street === suggestedAddress.addressLine1 &&
      userAddress.city === suggestedAddress.city &&
      userAddress.state === suggestedAddress.stateCode &&
      userAddress.postalCode === suggestedAddress.zipCode &&
      userAddress.country === suggestedAddress.countryCodeIso3
    );
  };

  // Handle Address Validation
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
        setIsLoading(false);
      } catch (error) {
        setIsLoading(true);
      }
    }
    fetchSuggestedAddresses();
  }, []);

  useEffect(
    () => {
      setSuggestedAddress(addressValidation.confirmedSuggestions[0]);
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
      'application.applicant[view:applicantInfo].mailingAddress',
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

  return shouldShowSuggestedAddress() ? (
    <SuggestedAddressRadio
      title="Confirm your mailing address"
      userAddress={userAddress}
      selectedAddress={selectedAddress}
      addressValidation={addressValidation}
      onChangeSelectedAddress={onChangeSelectedAddress}
    />
  ) : (
    <AddressConfirmation />
  );
}

// Map state to props
const mapStateToProps = state => ({
  formData: state?.form?.data,
  addressValidation: state?.vapService?.addressValidation,
});

export default connect(mapStateToProps)(PreparerSuggestedAddress);
