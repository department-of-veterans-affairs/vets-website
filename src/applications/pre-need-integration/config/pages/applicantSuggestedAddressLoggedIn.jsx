import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import { setReturnState } from 'platform/forms-system/src/js/utilities/data/profile';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import AddressConfirmation from '../../components/AddressConfirmation';
import SuggestedAddressRadio from '../../components/SuggestedAddressRadio';
import { fetchSuggestedAddress, isAuthorizedAgent } from '../../utils/helpers';

export const envUrl = environment.API_URL;

function ApplicantSuggestedAddressLoggedIn({
  data,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const extractUserAddress = () => {
    return data?.application?.claimant?.address || {};
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
  }, []);

  // Maintain Screen Reader Focus after isLoading returns and resolves
  useEffect(
    () => {
      if (!isLoading) {
        const progressBar = document.getElementById('nav-form-header');
        if (progressBar) {
          progressBar.setAttribute('tabindex', '-1');
          progressBar.focus();
        }
      }
    },
    [isLoading],
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
        country: selected.country,
        state: selected.state,
        postalCode: selected.zipCode,
      };
    } else {
      newAddress = selected;
    }
    const updatedFormData = set(
      'application.claimant.address',
      newAddress,
      data,
    );
    dispatch(setData(updatedFormData));
  };

  const handleContinue = () => {
    // Set return state to show success message
    setReturnState('address,updated');

    // Clear the edit flag to return to normal flow
    const updatedFormData = {
      ...data,
      'view:loggedInEditAddress': false,
    };
    dispatch(setData(updatedFormData));

    // Navigate back to the logged-in mailing address page
    goToPath('/applicant-mailing-address-logged-in');
  };

  const handleBack = () => {
    // Go back to edit address page
    goToPath('/applicant-mailing-address-logged-in/edit-address');
  };

  if (isLoading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  return showSuggestions ? (
    <div>
      <SuggestedAddressRadio
        title={
          !isAuthorizedAgent(data)
            ? 'Confirm your mailing address'
            : 'Confirm applicant mailing address'
        }
        userAddress={userAddress}
        selectedAddress={selectedAddress}
        suggestedAddress={suggestedAddress}
        onChangeSelectedAddress={onChangeSelectedAddress}
      />
      <div className="form-progress-buttons vads-u-margin-y--2">
        <va-button text="Use this address" onClick={handleContinue} />
        <va-button
          text="Edit address"
          onClick={handleBack}
          secondary
          className="vads-u-margin-left--1"
        />
      </div>
      {contentBeforeButtons}
      {contentAfterButtons}
    </div>
  ) : (
    <div>
      <AddressConfirmation
        subHeader={
          !isAuthorizedAgent(data)
            ? 'Check your mailing address'
            : 'Check applicant mailing address'
        }
        userAddress={userAddress}
      />
      <div className="form-progress-buttons vads-u-margin-y--2">
        <va-button text="Continue" onClick={handleContinue} />
        <va-button
          text="Edit address"
          onClick={handleBack}
          secondary
          className="vads-u-margin-left--1"
        />
      </div>
      {contentBeforeButtons}
      {contentAfterButtons}
    </div>
  );
}

// Map state to props
const mapStateToProps = state => ({
  data: state?.form?.data,
});

export default connect(mapStateToProps)(ApplicantSuggestedAddressLoggedIn);
