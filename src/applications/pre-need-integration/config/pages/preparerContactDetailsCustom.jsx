import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { FIELD_NAMES } from '@@vap-svc/constants';
import { validateAddress } from 'platform/user/profile/vap-svc/actions';
import { formatAddress } from 'platform/forms/address/helpers';
import set from 'platform/utilities/data/set';
import { ValidateAddressTitle } from '../../components/PreparerHelpers';

function PreparerContanctDetailsCustom({ formData, addressValidation }) {
  const dispatch = useDispatch();
  const [userAddress, setUserAddress] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const formDataUserAddress =
      formData?.application?.applicant['view:applicantInfo']?.mailingAddress;
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
            formData?.application?.applicant['view:applicantInfo']
              ?.mailingAddress,
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

  const onChangeSelectedAddress = (address, id) => {
    setSelectedAddress(address);
    let newAddress;
    if (id !== 'userEntered') {
      newAddress = {
        street: address.addressLine1,
        street2: address.addressLine2,
        city: address.city,
        country: address.countryCodeIso3,
        state: address.stateCode,
        postalCode: address.zipCode,
      };
    } else {
      newAddress = address;
    }

    const updatedFormData = set(
      'application.applicant[view:applicantInfo].mailingAddress',
      newAddress,
      { ...formData }, // make a copy of the original formData
    );
    dispatch(setData(updatedFormData));
  };

  function formatUserAddress(address) {
    const { street } = address;
    const { country } = address;
    const cityStateZip = String(
      `${address.city}, ${address.state} ${address.postalCode}`,
    );
    return { street, cityStateZip, country };
  }

  function renderAddressOption(address, id = 'userEntered') {
    if (address !== undefined) {
      const { street, cityStateZip, country } =
        id !== 'userEntered'
          ? formatAddress(address)
          : formatUserAddress(address);

      return (
        <div
          key={id}
          className="vads-u-margin-bottom--1p5 address-validation-container"
        >
          <input
            type="radio"
            id={id}
            onChange={() => {
              onChangeSelectedAddress(address, id);
            }}
            checked={selectedAddress === address}
          />

          <label
            htmlFor={id}
            className="vads-u-margin-top--2 vads-u-display--flex vads-u-align-items--center"
          >
            <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-bottom--0p5">
              <span
                className="dd-privacy-hidden"
                data-dd-action-name="street address"
              >
                {street}
              </span>
              <span
                className="dd-privacy-hidden"
                data-dd-action-name="city, state and zip code"
              >
                {cityStateZip}
              </span>
              <span>{country}</span>
            </div>
          </label>
        </div>
      );
    }
    return null;
  }

  return isLoading ? (
    <va-loading-indicator label="Loading" message="Loading..." set-focus />
  ) : (
    <div
      className="va-profile-wrapper"
      id={`edit-${FIELD_NAMES.MAILING_ADDRESS}`}
    >
      <ValidateAddressTitle />
      <span className="vads-u-font-weight--bold">You entered:</span>
      {renderAddressOption(userAddress)}
      <span className="vads-u-font-weight--bold">Suggested Addresses:</span>
      {addressValidation?.confirmedSuggestions?.length !== 0 &&
        addressValidation?.confirmedSuggestions?.map((address, index) =>
          renderAddressOption(address, String(index)),
        )}
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
