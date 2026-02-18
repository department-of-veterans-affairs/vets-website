import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import set from 'platform/utilities/data/set';
import { setReturnState } from 'platform/forms-system/src/js/utilities/data/profile';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { createTransaction } from 'platform/user/profile/vap-svc/actions';
import { ADDRESS_POU } from 'platform/user/profile/vap-svc/constants';
import AddressConfirmation from '../../components/AddressConfirmation';
import SuggestedAddressRadio from '../../components/SuggestedAddressRadio';
import { fetchSuggestedAddress, isAuthorizedAgent } from '../../utils/helpers';

export const envUrl = environment.API_URL;

function ApplicantSuggestedAddressLoggedIn({
  data,
  goToPath,
  goBack,
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

  const handleContinue = async () => {
    // Prepare address for VA Profile update
    const formAddress = data?.application?.claimant?.address;
    let profileUpdateSuccess = true;

    if (formAddress) {
      // Convert form address to VA Profile format
      const vaProfileAddress = {
        addressLine1: formAddress.street,
        addressLine2: formAddress.street2 || null,
        addressLine3: null,
        addressPou: ADDRESS_POU.CORRESPONDENCE, // Mailing address
        city: formAddress.city,
        countryCodeIso3: formAddress.country || 'USA',
        province: null,
        stateCode: formAddress.state,
        zipCode: formAddress.postalCode,
      };

      try {
        // Update VA Profile with the new address
        const result = await dispatch(
          createTransaction(
            '/profile/addresses',
            'POST',
            'mailingAddress',
            vaProfileAddress,
            'mailing-address',
          ),
        );

        // Check if the transaction failed
        if (!result || result.error || result.errors) {
          profileUpdateSuccess = false;
        }
      } catch (error) {
        // If VA Profile update fails, still update the form
        profileUpdateSuccess = false;
      }
    }

    // Set return state to show appropriate message
    if (profileUpdateSuccess) {
      setReturnState('address,updated');
    } else {
      setReturnState('address,form-only');
    }

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
    // Use goBack to go to previous page
    if (goBack) {
      goBack();
    } else {
      // Fallback to edit address page
      goToPath('/applicant-mailing-address-logged-in/edit-address');
    }
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
      {contentBeforeButtons}
      <FormNavButtons goBack={handleBack} goForward={handleContinue} />
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
      {contentBeforeButtons}
      <FormNavButtons goBack={handleBack} goForward={handleContinue} />
      {contentAfterButtons}
    </div>
  );
}

// Map state to props
const mapStateToProps = state => ({
  data: state?.form?.data,
});

export default connect(mapStateToProps)(ApplicantSuggestedAddressLoggedIn);
