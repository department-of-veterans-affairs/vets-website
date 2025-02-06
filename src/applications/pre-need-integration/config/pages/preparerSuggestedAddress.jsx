import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import { focusElement } from 'platform/utilities/ui/focus';
import AddressConfirmation from '../../components/AddressConfirmation';
import SuggestedAddressRadio from '../../components/SuggestedAddressRadio';
import { fetchSuggestedAddress } from '../../utils/helpers';

function PreparerSuggestedAddress({ formData }) {
  const dispatch = useDispatch();
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const extractUserAddress = () => {
    return (
      formData?.application?.applicant['view:applicantInfo']?.mailingAddress ||
      {}
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const formDataUserAddress = extractUserAddress();
      setUserAddress(formDataUserAddress);
      setSelectedAddress(formDataUserAddress);

      const {
        fetchedSuggestedAddress,
        fetchedShowSuggestions,
      } = await fetchSuggestedAddress(formDataUserAddress);

      setSuggestedAddress(fetchedSuggestedAddress);
      setShowSuggestions(fetchedShowSuggestions);
      setIsLoading(false);
    };

    fetchData();
    focusElement('#address-validation-alert-heading');
  }, []);

  const onChangeSelectedAddress = event => {
    const selected = JSON.parse(event.detail.value);
    setSelectedAddress(selected);

    let newAddress;
    if ('addressLine1' in selected) {
      newAddress = {
        street: selected.addressLine1,
        street2: selected.addressLine2,
        city: selected.city,
        country: selected.country,
        state: selected.state,
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

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(PreparerSuggestedAddress);
