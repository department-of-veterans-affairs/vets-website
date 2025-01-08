import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { validateAddress } from 'platform/user/profile/vap-svc/actions';
import set from 'platform/utilities/data/set';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ValidateAddressTitle } from '../../components/PreparerHelpers';
import AddressConfirmation from './addressConfirmation';

const formatAddress = address => {
  if (address) {
    let displayAddress = '';
    const street = address.street || address.addressLine1;
    const street2 = address.street2 || address.addressLine2; // Fixed the typo
    const { city } = address;
    const state = address.state || address.stateCode;
    const zip = address.postalCode || address.zipCode;

    if (street) displayAddress += street;
    if (street2) displayAddress += `, ${street2}`;
    if (city) displayAddress += `, ${city}`;
    if (state) displayAddress += `, ${state}`;
    if (zip) displayAddress += ` ${zip}`; // Added a space instead of comma before zip

    return displayAddress.trim();
  }
  return ''; // Return an empty string if no address is provided
};

function SponsorSuggestedAddress({ formData, addressValidation }) {
  const dispatch = useDispatch();
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedAddress, setSuggestedAddress] = useState(null);

  // Extract address details from formData
  const extractUserAddress = () =>
    formData?.application?.veteran?.address || {};

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

  if (shouldShowSuggestedAddress()) {
    return (
      <div
        className="va-profile-wrapper"
        id={`edit-${FIELD_NAMES.MAILING_ADDRESS}`}
      >
        <ValidateAddressTitle title="Confirm sponsor mailing address" />
        <VaRadio
          label="Tell us which address you'd like to use."
          onVaValueChange={onChangeSelectedAddress}
          required
        >
          {userAddress && (
            <va-radio-option
              key="userAddress"
              name="addressGroup"
              label="Address you entered:"
              description={formatAddress(userAddress)}
              value={JSON.stringify(userAddress)}
              tile
              checked={
                JSON.stringify(selectedAddress) === JSON.stringify(userAddress)
              }
            />
          )}
          {addressValidation?.confirmedSuggestions?.[0] && (
            <va-radio-option
              key="suggestedAddress"
              name="addressGroup"
              label="Suggested address:"
              description={formatAddress(
                addressValidation?.confirmedSuggestions[0],
              )}
              value={JSON.stringify(addressValidation?.confirmedSuggestions[0])}
              tile
              checked={
                JSON.stringify(selectedAddress) ===
                JSON.stringify(addressValidation?.confirmedSuggestions[0])
              }
            />
          )}
        </VaRadio>
      </div>
    );
  }

  return <AddressConfirmation />;
}

// Map state to props
const mapStateToProps = state => ({
  formData: state?.form?.data,
  addressValidation: state?.vapService?.addressValidation,
});

export default connect(mapStateToProps)(SponsorSuggestedAddress);
