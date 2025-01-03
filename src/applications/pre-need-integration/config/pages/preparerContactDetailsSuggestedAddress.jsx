import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { validateAddress } from 'platform/user/profile/vap-svc/actions';
// import { formatAddress } from 'platform/forms/address/helpers';
import set from 'platform/utilities/data/set';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { ValidateAddressTitle } from '../../components/PreparerHelpers';

function PreparerContanctDetailsCustom({ formData, addressValidation }) {
  const dispatch = useDispatch();
  const [userAddress, setUserAddress] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const formDataUserAddress =
      formData?.application?.applicant['view:applicantInfo']?.mailingAddress;

    const addressForAPIRequest = {
      addressLine1: formDataUserAddress.street,
      addressLine2: formDataUserAddress.street2,
      addressPou: 'CORRESPONDENCE',
      addressType: 'DOMESTIC',
      city: formDataUserAddress.city,
      countryCodeIso3: formDataUserAddress.country,
      stateCode: formDataUserAddress.state,
      zipCode: formDataUserAddress.postalCode,
    };

    async function getSuggestedAddresses() {
      try {
        setUserAddress(formDataUserAddress);
        setSelectedAddress(formDataUserAddress);
        // Dispatch suggestedAddresses to vapService redux store
        await dispatch(
          validateAddress(
            '/profile/addresses',
            'POST',
            'mailingAddress',
            addressForAPIRequest,
            'mailing-address',
          ),
        );
        setIsLoading(false);
      } catch (error) {
        setIsLoading(true);
      }
    }
    getSuggestedAddresses();
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

  return isLoading ? (
    <va-loading-indicator label="Loading" message="Loading..." set-focus />
  ) : (
    <div
      className="va-profile-wrapper"
      id={`edit-${FIELD_NAMES.MAILING_ADDRESS}`}
    >
      <ValidateAddressTitle />
      <VaRadio
        label="Tell us which address you'd like to use."
        onVaValueChange={onChangeSelectedAddress}
        required
      >
        {userAddress && (
          <va-radio-option
            key="userAddress"
            name="addressGroup"
            label={`Address you entered: \n${userAddress.street}`}
            value={JSON.stringify(userAddress)}
            tile
            checked={
              selectedAddress &&
              JSON.stringify(selectedAddress) === JSON.stringify(userAddress)
            }
          />
        )}
        {addressValidation?.confirmedSuggestions[0] && (
          <va-radio-option
            key="suggestedAddress"
            name="addressGroup"
            label={`Suggested address: \n${
              addressValidation?.confirmedSuggestions[0].addressLine1
            }`}
            value={JSON.stringify(addressValidation?.confirmedSuggestions[0])}
            tile
            checked={
              selectedAddress &&
              JSON.stringify(selectedAddress) ===
                JSON.stringify(addressValidation?.confirmedSuggestions[0])
            }
          />
        )}
      </VaRadio>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    formData: state?.form?.data,
    addressValidation: state?.vapService?.addressValidation,
  };
};

export default connect(mapStateToProps)(PreparerContanctDetailsCustom);
