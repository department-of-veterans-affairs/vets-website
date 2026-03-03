import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import set from 'platform/utilities/data/set';
import AddressConfirmation from '../components/AddressConfirmation';
import SuggestedAddressRadio from '../components/SuggestedAddressRadio';
import { fetchSuggestedAddress } from '../utils/helpers';

function ApplicantSuggestedAddressNotLoggedIn({
  data,
  goBack,
  goForward,
  goToPath,
  NavButtons,
  contentBeforeButtons,
  contentAfterButtons,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [userAddress, setUserAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(null);

  const extractUserAddress = () => {
    return data?.applicantMailingAddress || {};
  };

  useEffect(() => {
    const fetchData = async () => {
      const formDataUserAddress = extractUserAddress();
      setUserAddress(formDataUserAddress);
      setSelectedAddress(formDataUserAddress);

      const {
        fetchedSuggestedAddress,
        fetchedShowSuggestions,
        fetchedConfidenceScore,
      } = await fetchSuggestedAddress(formDataUserAddress);

      setSuggestedAddress(fetchedSuggestedAddress);
      setShowSuggestions(fetchedShowSuggestions);
      setConfidenceScore(fetchedConfidenceScore);
      setIsLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const updatedFormData = set('applicantMailingAddress', newAddress, data);
    dispatch(setData(updatedFormData));
  };

  const handleContinue = () => {
    // Check if we're in edit mode (editing from review page)
    const isEditMode = data?.['view:notLoggedInEditAddress'] === true;

    if (isEditMode) {
      // Clear the edit flag to return to normal flow
      const updatedFormData = {
        ...data,
        'view:notLoggedInEditAddress': false,
      };
      dispatch(setData(updatedFormData));

      // Check if there's a stored return path
      const returnPath = sessionStorage.getItem('addressEditReturnPath');
      if (returnPath) {
        sessionStorage.removeItem('addressEditReturnPath');
        goToPath(returnPath);
      } else {
        // Default to review page
        goToPath('/review-and-submit');
      }
      return;
    }

    // Normal flow - just continue to next page
    if (goForward) {
      goForward({ formData: data });
    }
  };

  const handleBack = () => {
    // Use goBack to go to previous page
    if (goBack) {
      goBack();
    } else {
      // Fallback to edit address page
      goToPath('/applicant-mailing-address/edit');
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
        title="Select your mailing address"
        userAddress={userAddress}
        selectedAddress={selectedAddress}
        suggestedAddress={suggestedAddress}
        onChangeSelectedAddress={onChangeSelectedAddress}
      />
      {contentBeforeButtons}
      {NavButtons && (
        <NavButtons goBack={handleBack} goForward={handleContinue} />
      )}
      {contentAfterButtons}
    </div>
  ) : (
    <div>
      <AddressConfirmation
        subHeader="Check your mailing address"
        userAddress={userAddress}
        isExactMatch={confidenceScore === 100}
      />
      {contentBeforeButtons}
      {NavButtons && (
        <NavButtons goBack={handleBack} goForward={handleContinue} />
      )}
      {contentAfterButtons}
    </div>
  );
}

ApplicantSuggestedAddressNotLoggedIn.propTypes = {
  NavButtons: PropTypes.func,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    applicantMailingAddress: PropTypes.object,
    'view:notLoggedInEditAddress': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
};

// Map state to props
const mapStateToProps = state => ({
  data: state?.form?.data,
});

export default connect(mapStateToProps)(ApplicantSuggestedAddressNotLoggedIn);
