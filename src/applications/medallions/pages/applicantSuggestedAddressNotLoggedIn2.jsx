import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import set from 'platform/utilities/data/set';
import AddressConfirmation from '../components/AddressConfirmation';
import SuggestedAddressRadio from '../components/SuggestedAddressRadio';
import { fetchSuggestedAddress } from '../utils/helpers';

function ApplicantSuggestedAddressNotLoggedIn2({
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
    return data?.address || {};
  };

  useEffect(
    () => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
    const updatedFormData = set('address', newAddress, data);
    dispatch(setData(updatedFormData));
  };

  const handleBack = () => {
    // Use goBack to go to previous page
    if (goBack) {
      goBack();
    } else {
      // Fallback to organization mailing address page
      goToPath('/applicant-mailing-address-2');
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
        title="Confirm your organization's mailing address"
        userAddress={userAddress}
        selectedAddress={selectedAddress}
        suggestedAddress={suggestedAddress}
        onChangeSelectedAddress={onChangeSelectedAddress}
      />
      {contentBeforeButtons}
      <FormNavButtons goBack={handleBack} />
      {contentAfterButtons}
    </div>
  ) : (
    <div>
      <AddressConfirmation
        subHeader="Check your organization's mailing address"
        userAddress={userAddress}
      />
      {contentBeforeButtons}
      <FormNavButtons goBack={handleBack} />
      {contentAfterButtons}
    </div>
  );
}

ApplicantSuggestedAddressNotLoggedIn2.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    address: PropTypes.object,
  }),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
};

// Map state to props
const mapStateToProps = state => ({
  data: state?.form?.data,
});

export default connect(mapStateToProps)(ApplicantSuggestedAddressNotLoggedIn2);
